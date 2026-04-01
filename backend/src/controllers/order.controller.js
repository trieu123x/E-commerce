import db from "../../models/index.js";

export const createOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const { address_id } = req.body;

    const { Cart, CartItem, Product, Order, OrderItem, Address } = db;

    // Kiểm tra address
    const address = await Address.findOne({
      where: { id: address_id, user_id: userId },
      transaction,
    });
    if (!address) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Địa chỉ giao hàng không hợp lệ",
      });
    }

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      transaction,
    });

    if (!cart || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    let totalAmount = 0;
    const orderItemsData = [];
    const productsToUpdate = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product || product.status !== "ACTIVE") {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product?.name || ""} không khả dụng`,
        });
      }

      if (product.stock < cartItem.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.name} không đủ hàng`,
        });
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

    // Tạo order
    const order = await Order.create(
      {
        user_id: userId,
        address_id: address_id,
        total_amount: totalAmount,
        status: "PENDING",
      },
      { transaction },
    );

    //  Tạo order items
    for (const itemData of orderItemsData) {
      await OrderItem.create(
        {
          order_id: order.id,
          ...itemData,
        },
        { transaction },
      );
    }

    //  Trừ stock
    for (const { product, quantity } of productsToUpdate) {
      product.stock -= quantity;
      await product.save({ transaction });
    }

    //  Xóa cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng",
    });
  }
};
export const createOrderFromItems = async (userId, items, address_id, payment_method) => {
  const transaction = await db.sequelize.transaction();
  function getBestSalePrice(product, sales) {
    const now = new Date();

    let price_after = product.price;
    let saleName = null

    const activeSales = sales?.filter(
      (sale) =>
        sale.is_active &&
        new Date(sale.start_date) <= now &&
        new Date(sale.end_date) >= now,
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
          saleName = sale.name
        }
      });
    }
  
    return {
      price_after: price_after,
      sale: saleName,
    };
  }
  try {
    const { Product, Order, OrderItem, Address, Sale } = db;

    // Check address
    const address = await Address.findOne({
      where: { id: address_id, user_id: userId },
      transaction,
    });

    if (!address) {
      throw new Error("Địa chỉ giao hàng không hợp lệ");
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, {
        transaction,
        lock: transaction.LOCK.UPDATE, // chống oversell
      });
      const sales = await product.getSales({ transaction });
      const { price_after } = getBestSalePrice(product, sales);
console.log(price_after)
      const itemTotal = price_after * item.quantity;

      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: product.id,
        quantity: item.quantity,
        price: price_after,
        total: itemTotal,
        product_name: product.name,
      });

      // trừ stock
      product.stock -= item.quantity;
      await product.save({ transaction });
    }
    //  Tạo Order
    const order = await Order.create(
      {
        user_id: userId,
        shipping_address:
          address.address + ", " + address.district + ", " + address.ward,
        total_amount: totalAmount,
        status: payment_method === "COD" ? "COMPLETED" : "PENDING",
        payment_method,
      },
      { transaction },
    );
    console.log(order);
    
    // Tạo Payment record
    await db.Payment.create(
      {
        order_id: order.id,
        method: payment_method || "COD",
        status: payment_method === "COD" ? "COMPLETED" : "PENDING",
        // paid_at is set by defaultValue in model
      },
      { transaction },
    );
    
    // Tạo OrderItems
    await OrderItem.bulkCreate(
      orderItemsData.map((item) => ({
        ...item,
        order_id: order.id,
      })),
      { transaction },
    );

    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    throw error;
  }
};
export const buyNow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1, address_id, items,payment_method } = req.body;
console.log("Buy Now payload:", req.body);
    let orderItems = [];

    // 🔹 Nếu là thanh toán từ cart
    if (items && Array.isArray(items) && items.length > 0) {
      orderItems = items;
    }

    // 🔹 Nếu là mua lẻ (buy now)
    else if (product_id) {
      orderItems = [
        {
          product_id,
          quantity,
        },
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: "Không có sản phẩm để đặt hàng",
      });
    }

    const order = await createOrderFromItems(userId, orderItems, address_id, payment_method);

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_order = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;

    const { Order, OrderItem, Product, ProductImage, Payment } = db;
    const where = { user_id: userId };

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["id", "method", "status", "paid_at"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: ProductImage,
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
    const total = await Order.count({ where });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { Order, OrderItem, Product } = db;
    const order = await Order.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_order = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;
    const { Order, OrderItem, Product, User } = db;

    const where = {};
    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order]],
    });
    const total = await Order.count({ where });
    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { Order, OrderItem, Product, ProductImage, User, Address } = db;
    console.log("params:", req.params);
    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: ProductImage,
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
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    // lấy address từ shipping_address
    let address = null;

    if (order.shipping_address) {
      address = await Address.findByPk(order.shipping_address, {
        attributes: ["id", "address", "district", "ward"],
      });
    }

    const orderData = order.toJSON();
    orderData.address = address;

    res.json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đơn hàng",
    });
  }
};
