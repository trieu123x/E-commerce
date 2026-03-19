import express from "express";
import db from "../../../models/index.js";
import { Op } from "sequelize";

const { Review, Product, User,ProductImage } = db;
const router = express.Router();

// Lấy danh sách tất cả review
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      rating,
      product_id,
      search,
    } = req.query;

    const where = {};
const productWhere = {};
    // Lọc theo rating
    if (rating) {
      where.rating = parseInt(rating);
    }

    // Lọc theo product_id
    if (product_id) {
      where.product_id = parseInt(product_id);
    }

    // Tìm kiếm theo product
    if (search) {
  productWhere.name = { [Op.iLike]: `%${search}%` };
}

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.findAll({
      where,
      include: [
        {
  model: Product,
  as: "product",
  attributes: ["id", "name", "price"],
  where: Object.keys(productWhere).length ? productWhere : undefined,
  required: search ? true : false,
  include: [
    {
      model: ProductImage,
      as: "images",
      attributes: ["id", "image_url"],
      where: { is_main: true },
      required: false,
    },
  ],
},
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "full_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const total = await Review.count({ where });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Lấy chi tiết một review
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "description", "price"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "full_name", "phone"],
        },
      ],
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review không tồn tại",
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Sửa review (chỉnh sửa rating hoặc comment)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review không tồn tại",
      });
    }

    // Validate rating nếu có
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating phải từ 1 đến 5",
        });
      }
    }

    // Update review
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.json({
      success: true,
      message: "Cập nhật review thành công",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Xóa review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review không tồn tại",
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: "Xóa review thành công",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

export default router;
