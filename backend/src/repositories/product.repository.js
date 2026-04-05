import db from "../../models/index.js";
import { Op, literal } from "sequelize";

const { Product, ProductImage, Sale } = db;

class ProductRepository {
  async findAll({ where, include, limit, offset, order }) {
    return await Product.findAll({
      where,
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM wishlists
              WHERE wishlists.product_id = "Product".id
            )`),
            "likes",
          ],
          [
            literal(`(
              SELECT COALESCE(AVG(rating),0)
              FROM reviews
              WHERE reviews.product_id = "Product".id
            )`),
            "avg_rating",
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM reviews
              WHERE reviews.product_id = "Product".id
            )`),
            "review_count",
          ],
        ],
      },
      include,
      subQuery: false,
      limit,
      offset,
      order,
    });
  }

  async count({ where, include }) {
    return await Product.count({
      where,
      include,
      distinct: true,
    });
  }

  async findById(id) {
    return await Product.findByPk(id, {
      attributes: {
        include: [
          [
            literal(`(
              SELECT COALESCE(AVG(rating),0)
              FROM reviews
              WHERE reviews.product_id = "Product".id
            )`),
            "rating",
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM reviews
              WHERE reviews.product_id = "Product".id
            )`),
            "review_count",
          ],
        ],
      },
      include: [
        { model: ProductImage, as: "images" },
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
    });
  }
}

export default new ProductRepository();
