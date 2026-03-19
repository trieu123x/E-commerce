import { defaults } from "pg";
import db from "../../models/index.js";
import { where } from "sequelize";

export const getCart = async (req, res) => {
  try {
    const { Cart, CartItem, Product, ProductImage, Sale } = db;
    const userId = req.user.id;

    // Tìm giỏ hàng của người dùng
    const [cart, created] = await db.Cart.findOrCreate({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id",
                "name",
                "price",
                "stock",
                "description",
                "status",
              ],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["image_url", "id"],
                  where: { is_main: true },
                  required: false,
                },
                {
                  model: Sale,
                  as: "sales",
                  attributes: [
                    "name",
                    "discount_type",
                    "discount_value",
                    "start_date",
                    "end_date",
                    "is_active",
                  ],
                  required: false,
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart.items) cart.items = [];

    const total = cart.items.reduce((sum, item) => {
      if (item.product && item.product.status === "ACTIVE") {
        return sum + parseFloat(item.product.price) * item.quantity;
      }
      return sum;
    }, 0);

    const activeItems = cart.items.filter(
      (item) => item.product && item.product.status === "ACTIVE",
    );
    res.json({
      success: true,
      cart: {
        id: cart.id,
        user_id: cart.user_id,
        items: activeItems.map((item) => {
          const product = item.product;
          const now = new Date()
          let price = parseFloat(product.price);
          let price_after = product.price;
          let saleName = null;

          const activeSales = product.sales?.filter(
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
                saleName = sale.name;
              }
            });
          }

          return {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            product_name: product.name,
            price,
            price_after,
            saleName,
            quantity: item.quantity,
            image_url: product.images?.[0]?.image_url || null,
            stock: product.stock,
            total: price_after * item.quantity,
          };
        }),
        summary: {
          totalItems: activeItems.length,
          totalQuantity: activeItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          ),
          totalPrice: total,
        },
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy giỏ hàng",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    const { Cart, CartItem, Product, ProductImage, Sale } = db;

    const product = await Product.findByPk(productId, {
      include: [
        {
              model: Sale,
          as: "sales",
          attributes: [
            "id",
            "name",
            "discount_type",
            "discount_value",
            "start_date",
            "end_date",
            "is_active",
          ],
          through: { attributes: [] },
          required: false
            },
      ],
    });

    if (!product || product.status !== "ACTIVE") {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại hoặc không khả dụng",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Số lượng sản phẩm trong kho không đủ",
      });
    }

    const [cart] = await Cart.findOrCreate({
      where: { user_id: userId },
      defaults: { user_id: userId },
    });

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, product_id: productId },
      defaults: {
        cart_id: cart.id,
        product_id: productId,
        quantity: quantity,
      },
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "stock", "description"],
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["image_url"],
              where: { is_main: true },
              required: false,
            },
            {
              model: Sale,
          as: "sales",
          attributes: [
            "id",
            "name",
            "discount_type",
            "discount_value",
            "start_date",
            "end_date",
            "is_active",
          ],
          through: { attributes: [] },
          required: false
            },
          ],
        },
      ],
    });

    const productData = updatedCartItem.product;

    let price = parseFloat(productData.price);
     const now = new Date();

    let price_after = product.price;
    let saleName = null

    const activeSales = product.sales?.filter(
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

    res.status(201).json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
      cartItem: {
        id: updatedCartItem.id,
        product_id: updatedCartItem.product_id,
        product_name: productData.name,
        price,
        price_after,
        saleName,
        quantity: updatedCartItem.quantity,
        stock: productData.stock,
        image:
          productData.images?.length > 0
            ? productData.images[0].image_url
            : null,
        total: price_after * updatedCartItem.quantity,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sản phẩm vào giỏ hàng",
    });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
    const { Cart, CartItem, Product, Sale,ProductImage } = db;


    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không hợp lệ",
      });
    }

    const cartItem = await CartItem.findOne({
      where: { id: itemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id: userId },
        },
        {
          model: Product,
          as: "product",
          include: [
            {
              model: Sale,
          as: "sales",
          attributes: [
            "id",
            "name",
            "discount_type",
            "discount_value",
            "start_date",
            "end_date",
            "is_active",
          ],
          through: { attributes: [] },
          required: false
            },
            {
              model: ProductImage,
              as: "images",
              attributes: ["image_url"],
              where: { is_main: true },
              required: false,
            }
          ],
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        success: false,
        message: `Số lượng trong kho không đủ. Chỉ còn ${cartItem.product.stock} sản phẩm`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const product = cartItem.product;

    let price = parseFloat(product.price);
     const now = new Date();

    let price_after = product.price;
    let saleName = null

    const activeSales = product.sales?.filter(
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

    res.json({
      success: true,
      message: "Đã cập nhật số lượng",
      cartItem: {
        id: cartItem.id,
        product_id: cartItem.product_id,
        product_name: product.name,
        price,
        price_after,
        saleName,
        image: product.images?.length > 0
            ? product.images[0].image_url
            : null,
        quantity: cartItem.quantity,
        stock: product.stock,
        total: price_after * cartItem.quantity,
      },
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật giỏ hàng",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const { Cart, CartItem } = db;

    console.log(`Remove from cart - Item: ${itemId}`);

    // Xóa cart item với điều kiện user sở hữu
    const deleted = await CartItem.destroy({
      where: { id: itemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id: userId },
        },
      ],
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa khỏi giỏ hàng",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { Cart, CartItem } = db;

    console.log(` Clear cart - User: ${userId}`);

    // Tìm cart của user
    const cart = await Cart.findOne({
      where: { user_id: userId },
    });

    if (!cart) {
      return res.json({
        success: true,
        message: "Giỏ hàng đã trống",
        deletedCount: 0,
      });
    }

    // Xóa tất cả items trong cart
    const deletedCount = await CartItem.destroy({
      where: { cart_id: cart.id },
    });

    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
      deletedCount: deletedCount,
    });
  } catch (error) {
    console.error(" Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa giỏ hàng",
    });
  }
};

export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { Cart, CartItem } = db;

    // Tìm cart của user
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: ["quantity"],
        },
      ],
    });

    let totalQuantity = 0;
    if (cart && cart.items) {
      totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    res.json({
      success: true,
      count: totalQuantity,
      message:
        totalQuantity === 0
          ? "Giỏ hàng trống"
          : `Có ${totalQuantity} sản phẩm trong giỏ`,
    });
  } catch (error) {
    console.error(" Get cart count error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đếm giỏ hàng",
    });
  }
};
