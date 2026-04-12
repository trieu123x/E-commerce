import express from "express";
import db from "../../../models/index.js";
import { Op } from "sequelize";
import userService from "../../services/user.service.js";

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
      order_id,
      start_date,
      end_date,
      min_price,
      max_price,
      sort_by = "created_at",
      sort_order = "DESC"
    } = req.query;

    const where = {};
    
    // Lọc theo trạng thái
    if (status && status !== "ALL") {
      where.status = status;
    }

    // Lọc theo order ID
    if (order_id) {
      where.id = order_id;
    }

    // Lọc theo khoảng ngày
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        where.created_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.created_at[Op.lte] = endDateTime;
      }
    }

    // Lọc theo giá tiền
    if (min_price || max_price) {
      where.total_amount = {};
      if (min_price) {
        where.total_amount[Op.gte] = parseFloat(min_price);
      }
      if (max_price) {
        where.total_amount[Op.lte] = parseFloat(max_price);
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Xác định thứ tự sắp xếp
    const sortArray = [];
    const validSortFields = ["created_at", "id", "total_amount"];
    const sortByField = validSortFields.includes(sort_by) ? sort_by : "created_at";
    const sortDirection = ["ASC", "DESC"].includes(sort_order?.toUpperCase()) ? sort_order.toUpperCase() : "DESC";
    sortArray.push([sortByField, sortDirection]);

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
      order: sortArray,
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

    // Update user VIP status if order is completed
    if (status === "COMPLETED") {
      try {
        await userService.updateVipStatus(order.user_id);
      } catch (err) {
        console.error("Error updating VIP status:", err);
        // Don't fail the response if VIP update fails
      }
    }

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
