import express from "express";
import db from "../../../models/index.js";
import { Op } from "sequelize";

const { Order, OrderItem, User, Product, ProductImage, Payment } = db;
const router = express.Router();

// Lấy danh sách tất cả order (kèm thông tin user)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
    } = req.query;

    const where = {};
    
    // Lọc theo trạng thái
    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["id", "method", "status", "paid_at"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "full_name"],
        },
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "quantity", "price", "total"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "image_url"],
                  where: { is_main: true },
                  required: false
                }
              ]
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
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
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Lấy chi tiết một order (bao gồm các item và product)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "full_name", "phone"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "description", "price"],
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
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Cập nhật trạng thái order
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate trạng thái
    const validStatuses = ["PENDING","COMPLETED" , "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    await order.update({ status });

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Xóa order
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    // Xóa các OrderItem liên quan trước
    await OrderItem.destroy({
      where: { order_id: id },
    });

    // Xóa order
    await order.destroy();

    res.json({
      success: true,
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

export default router;
