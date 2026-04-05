import db from "../../models/index.js";

const { Wishlist, Product, ProductImage, Sale } = db;

class WishlistRepository {
  async findAll(userId) {
    return await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductImage,
              as: "images",
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
              required: false,
            },
          ],
        },
      ],
    });
  }

  async findOne(where) {
    return await Wishlist.findOne({ where });
  }

  async create(data) {
    return await Wishlist.create(data);
  }

  async delete(where) {
    return await Wishlist.destroy({ where });
  }
}

export default new WishlistRepository();
