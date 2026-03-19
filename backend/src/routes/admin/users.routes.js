import express from "express";
import db from "../../../models/index.js";
import { Op } from "sequelize";

const { User } = db;
const router = express.Router();

// Lấy danh sách tất cả user
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
    } = req.query;

    const where = {};

    // Lọc theo role
    if (role) {
      where.role = role;
    }

    // Lọc theo status
    if (status) {
      where.status = status;
    }

    // Tìm kiếm theo email hoặc full_name
    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { full_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password_hash"] }, // Không trả về mật khẩu
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const total = await User.count({ where });

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Lấy chi tiết một user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Cập nhật thông tin user (full_name, phone)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Update các trường được phép
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: "Cập nhật người dùng thành công",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Khóa user
router.patch("/:id/lock", async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho khóa chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Không thể khóa tài khoản của chính mình",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    user.status = "LOCKED";
    await user.save();

    res.json({
      success: true,
      message: "Đã khóa người dùng",
      data: user,
    });
  } catch (error) {
    console.error("Lock user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Mở khóa user
router.patch("/:id/unlock", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    user.status = "ACTIVE";
    await user.save();

    res.json({
      success: true,
      message: "Đã mở khóa người dùng",
      data: user,
    });
  } catch (error) {
    console.error("Unlock user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Xóa user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho xóa chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa tài khoản của chính mình",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Cập nhật vai trò user (admin/customer)
router.patch("/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ (admin hoặc customer)",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `Cập nhật vai trò thành ${role === "admin" ? "Admin" : "Khách hàng"}`,
      data: user,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

export default router;
