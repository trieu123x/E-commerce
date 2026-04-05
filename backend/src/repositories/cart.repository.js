import db from "../../models/index.js";

const { Cart, CartItem, Product, ProductImage, Sale } = db;

class CartRepository {
  async findOrCreateCart(userId) {
    return await Cart.findOrCreate({
      where: { user_id: userId },
      defaults: { user_id: userId },
    });
  }

  async findCartWithItems(userId) {
    return await Cart.findOne({
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
                    "id",
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
  }

  async findCartItem(cartId, productId) {
    return await CartItem.findOne({
      where: { cart_id: cartId, product_id: productId },
    });
  }

  async createCartItem(cartId, productId, quantity) {
    return await CartItem.create({
      cart_id: cartId,
      product_id: productId,
      quantity: quantity,
    });
  }

  async updateCartItem(itemId, quantity) {
    return await CartItem.update({ quantity }, { where: { id: itemId } });
  }

  async deleteCartItem(itemId, userId) {
    return await CartItem.destroy({
      where: { id: itemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id: userId },
        },
      ],
    });
  }

  async clearCart(cartId) {
    return await CartItem.destroy({
      where: { cart_id: cartId },
    });
  }

  async findCartItemWithProduct(itemId, userId) {
    return await CartItem.findOne({
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
              required: false,
            },
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
    });
  }
}

export default new CartRepository();
