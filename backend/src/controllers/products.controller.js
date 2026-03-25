import db from "../../models/index.js";
import { Op } from "sequelize";
import { fn, col, literal } from "sequelize";
const { Product, ProductImage, Wishlist, Review, Sale, ProductSale } = db;

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 21,
      search,
      category_id,
      min_price,
      max_price,
      sort_by = "created_at",
      sort_order = "DESC",
      sale
    } = req.query;

    const where = {};
    // Chỉ lấy sản phẩm có trạng thái khác "INACTIVE"
    where.status = { [Op.ne]: "INACTIVE" };
    // Tìm kiếm theo tên
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    // Lọc theo category
    if (category_id) {
      where.category_id = category_id;
    }

    // Lọc theo giá
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
          return [[literal("avg_rating"), sort_order]]; // cần có cột rating

        case "created_at":
        default:
          return [["created_at", sort_order]];
      }
    };
    const products = await Product.findAll({
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
      include: [
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
      ],

      subQuery: false,
      limit: parseInt(limit),
      offset,
      order: getSortOption(sort_by, sort_order),
    });

    const total = await Product.count({
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
  distinct: true
});

    // Format response
    const now = new Date();

    const formattedProducts = products.map((product) => {
      let sale =null
      let price_after = product.price;

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
            sale = sale.name
          }
        });
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        price_after: parseFloat(price_after),
        saleName: sale,
        stock: product.stock,
        category_id: product.category_id,
        status: product.status,

        likes: parseInt(product.get("likes")) || 0,

        rating: product.get("avg_rating")
          ? parseFloat(product.get("avg_rating")).toFixed(1)
          : 0,

        review_count: parseInt(product.get("review_count")) || 0,

        main_image:
          product.images && product.images.length > 0
            ? product.images[0].image_url
            : null,

        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    });

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
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
          required: false
        },
      ],
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }
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

    // Format product response
    const formattedProduct = {
      ...product.toJSON(),

      price: parseFloat(product.price),
      price_after: parseFloat(price_after),
      saleName: saleName,
      rating: product.get("rating")
        ? parseFloat(product.get("rating")).toFixed(1)
        : 0,

      review_count: parseInt(product.get("review_count")) || 0,
    };

    res.json({
      success: true,
      product: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
