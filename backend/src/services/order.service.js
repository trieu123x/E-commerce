import orderRepository from "../repositories/order.repository.js";
import productRepository from "../repositories/product.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import db from "../../models/index.js";

/**
 * Service to handle order-related operations
 */
class OrderService {
  async createOrder(userId, address_id) {
    const transaction = await db.sequelize.transaction();
    try {
      const address = await db.Address.findOne({
        where: { id: address_id, user_id: userId },
        transaction,
      });
      if (!address) {
        throw new Error("Địa chỉ giao hàng không hợp lệ");
      }

      const cart = await cartRepository.findCartWithItems(userId);

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error("Giỏ hàng trống");
      }

      let totalAmount = 0;
      const orderItemsData = [];
      const productsToUpdate = [];

      for (const cartItem of cart.items) {
        const product = cartItem.product;

        if (!product || product.status !== "ACTIVE") {
          throw new Error(`Sản phẩm ${product?.name || ""} không khả dụng`);
        }

        if (product.stock < cartItem.quantity) {
          throw new Error(`Sản phẩm ${product.name} không đủ hàng`);
        }

        const price = parseFloat(product.price);
        const itemTotal = price * cartItem.quantity;

        totalAmount += itemTotal;

        orderItemsData.push({
          product_id: product.id,
          quantity: cartItem.quantity,
          price,
          total: itemTotal,
          product_name: product.name,
        });

        productsToUpdate.push({ product, quantity: cartItem.quantity });
      }

      const order = await orderRepository.create(
        {
          user_id: userId,
          address_id: address_id,
          total_amount: totalAmount,
          status: "PENDING",
        },
        { transaction }
      );

      for (const itemData of orderItemsData) {
        await orderRepository.createOrderItem(
          {
            order_id: order.id,
            ...itemData,
          },
          { transaction }
        );
      }

      for (const { product, quantity } of productsToUpdate) {
        product.stock -= quantity;
        await product.save({ transaction });
      }

      await cartRepository.clearCart(cart.id);

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createOrderFromItems(userId, items, address_id, payment_method) {
    const transaction = await db.sequelize.transaction();
    try {
      const address = await db.Address.findOne({
        where: { id: address_id, user_id: userId },
        transaction,
      });

      if (!address) {
        throw new Error("Địa chỉ giao hàng không hợp lệ");
      }

      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await productRepository.findById(item.product_id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        const sales = await product.getSales({ transaction });
        const { price_after } = this._getBestSalePrice(product, sales);

        const itemTotal = price_after * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          product_id: product.id,
          quantity: item.quantity,
          price: price_after,
          total: itemTotal,
          product_name: product.name,
        });

        product.stock -= item.quantity;
        await product.save({ transaction });
      }

      const order = await orderRepository.create(
        {
          user_id: userId,
          shipping_address:
            address.address + ", " + address.district + ", " + address.ward,
          total_amount: totalAmount,
          status: payment_method === "COD" ? "COMPLETED" : "PENDING",
          payment_method,
        },
        { transaction }
      );

      await orderRepository.createPayment(
        {
          order_id: order.id,
          method: payment_method || "COD",
          status: payment_method === "COD" ? "COMPLETED" : "PENDING",
        },
        { transaction }
      );

      await orderRepository.bulkCreateOrderItems(
        orderItemsData.map((item) => ({
          ...item,
          order_id: order.id,
        })),
        { transaction }
      );

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async buyNow(userId, { product_id, quantity = 1, address_id, items, payment_method }) {
    let orderItems = [];

    if (items && Array.isArray(items) && items.length > 0) {
      orderItems = items;
    } else if (product_id) {
      orderItems = [{ product_id, quantity }];
    } else {
      throw new Error("Không có sản phẩm để đặt hàng");
    }

    return await this.createOrderFromItems(userId, orderItems, address_id, payment_method);
  }

  async getOrdersByUserId(userId, { page = 1, limit = 10, sort_by = "created_at", sort_order = "DESC" }) {
    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    const orders = await orderRepository.findAll({
      where,
      include: [
        {
          model: db.Payment,
          as: "payment",
          attributes: ["id", "method", "status", "paid_at"],
        },
        {
          model: db.OrderItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: db.ProductImage,
                  as: "images",
                  attributes: ["id", "image_url", "is_main"],
                  where: { is_main: true },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order]],
    });

    const total = await orderRepository.count({ where });

    return {
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(userId, id) {
    const order = await orderRepository.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: db.OrderItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    return order;
  }

  async getAllOrders({ page = 1, limit = 10, sort_by = "created_at", sort_order = "DESC" }) {
    const offset = (page - 1) * limit;
    const where = {};
    const orders = await orderRepository.findAll({
      where,
      include: [
        {
          model: db.OrderItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order]],
    });

    const total = await orderRepository.count({ where });

    return {
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderDetails(id) {
    const order = await orderRepository.findOne({
      where: { id },
      include: [
        {
          model: db.OrderItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: db.ProductImage,
                  as: "images",
                  attributes: ["image_url"],
                  where: { is_main: true },
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    let address = null;
    if (order.shipping_address) {
      address = await db.Address.findByPk(order.shipping_address, {
        attributes: ["id", "address", "district", "ward"],
      });
    }

    const orderData = order.toJSON();
    orderData.address = address;

    return orderData;
  }

  async completeOrder(orderId) {
    try {
      await orderRepository.update(
        { status: "COMPLETED" },
        { where: { id: orderId } }
      );
      console.log(`Order ${orderId} marked as COMPLETED`);
      return { success: true };
    } catch (error) {
      console.error(`Error completing order ${orderId}:`, error);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    const transaction = await db.sequelize.transaction();
    try {
      const order = await orderRepository.findByPk(orderId, {
        include: [{ model: db.OrderItem, as: "items" }],
        transaction,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === "CANCELLED") {
        await transaction.rollback();
        return { success: true, message: "Order already cancelled" };
      }

      await orderRepository.update(
        { status: "CANCELLED" },
        { where: { id: orderId }, transaction }
      );

      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          const product = await productRepository.findById(item.product_id, {
            transaction,
          });
          if (product) {
            await product.increment("stock", { by: item.quantity, transaction });
            console.log(`Restored stock for product ${product.id}: +${item.quantity}`);
          }
        }
      }

      await transaction.commit();
      console.log(`Order ${orderId} marked as CANCELLED and stock restored`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  _getBestSalePrice(product, sales) {
    const now = new Date();
    let price_after = product.price;
    let saleName = null;

    const activeSales = sales?.filter(
      (sale) =>
        sale.is_active &&
        new Date(sale.start_date) <= now &&
        new Date(sale.end_date) >= now
    );

    if (activeSales && activeSales.length > 0) {
      activeSales.forEach((sale) => {
        let discountedPrice = product.price;
        if (sale.discount_type === "percent") {
          discountedPrice =
            product.price - (product.price * sale.discount_value) / 100;
        }
        if (sale.discount_type === "fixed") {
          discountedPrice = product.price - sale.discount_value;
        }
        if (discountedPrice < price_after) {
          price_after = discountedPrice;
          saleName = sale.name;
        }
      });
    }

    return { price_after, sale: saleName };
  }
}

export default new OrderService();
