import productRepository from "../repositories/product.repository.js";
import { Op, literal } from "sequelize";
import db from "../../models/index.js";

const { ProductImage, Sale } = db;

class ProductService {
  async getAllProducts(query) {
    const {
      page = 1,
      limit = 21,
      search,
      category_id,
      min_price,
      max_price,
      sort_by = "created_at",
      sort_order = "DESC",
      sale,
    } = query;

    const where = {};
    where.status = { [Op.ne]: "INACTIVE" };

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const getSortOption = (sort_by, sort_order) => {
      switch (sort_by) {
        case "likes":
          return [[literal("likes"), sort_order]];
        case "name":
          return [["name", sort_order]];
        case "rating":
          return [[literal("avg_rating"), sort_order]];
        case "created_at":
        default:
          return [["created_at", sort_order]];
      }
    };

    const include = [
      {
        model: ProductImage,
        as: "images",
        attributes: ["id", "image_url", "is_main"],
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
        where: sale ? { id: sale } : undefined,
        required: !!sale,
      },
    ];

    const products = await productRepository.findAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: getSortOption(sort_by, sort_order),
    });

    const total = await productRepository.count({
      where,
      include: sale
        ? [
            {
              model: Sale,
              as: "sales",
              through: { attributes: [] },
              where: { id: sale },
              required: true,
            },
          ]
        : [],
    });

    const formattedProducts = products.map((product) =>
      this._formatProduct(product)
    );

    return {
      data: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return this._formatProduct(product);
  }

  _formatProduct(product) {
    const now = new Date();
    let saleName = null;
    let price_after = product.price;

    const activeSales = product.sales?.filter(
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

    const productJson = product.toJSON ? product.toJSON() : product;

    return {
      ...productJson,
      price: parseFloat(product.price),
      price_after: parseFloat(price_after),
      saleName: saleName,
      likes: parseInt(product.get ? product.get("likes") : product.likes) || 0,
      rating: (product.get ? product.get("avg_rating") || product.get("rating") : product.avg_rating || product.rating)
        ? parseFloat(product.get ? product.get("avg_rating") || product.get("rating") : product.avg_rating || product.rating).toFixed(1)
        : 0,
      review_count:
        parseInt(product.get ? product.get("review_count") : product.review_count) || 0,
      main_image:
        product.images && product.images.length > 0
          ? product.images[0].image_url
          : null,
    };
  }
}

export default new ProductService();
