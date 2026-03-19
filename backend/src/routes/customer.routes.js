import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isCustomer, isAdmin, authorize } from "../middlewares/role.middlewares.js";
import db from "../../models/index.js";

const {User} = db
const router = express.Router();

router.use(authMiddleware);
router.use(authorize("admin", "customer"));

router.get("/test", (req, res) => {
  console.log("✅ GET /api/customer/test called");
  res.json({ message: "Customer routes working" });
});

router.get("/profile", (req, res) => {
  res.json({
    success: true,
    message: "User profile",
    user: req.user
  });
});

router.put("/profile", async (req, res) => {
  try {
    const { fullName, phone} = req.body;
    
    // Tìm user hiện tại
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Cập nhật thông tin user
    const updatedFields = {};
    
    if (fullName !== undefined) updatedFields.full_name = fullName;
    if (phone !== undefined) updatedFields.phone = phone;

    
    // Chỉ update nếu có thay đổi
    if (Object.keys(updatedFields).length > 0) {
      await user.update(updatedFields);
    }
    
    // Lấy lại thông tin user đã được cập nhật
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Loại bỏ password khi trả về
    });
    
    res.json({
      success: true,
      message: "Cập nhật profile thành công",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Thêm route để lấy chi tiết profile (nếu cần)
router.get("/profile/detail", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      // Có thể include thêm các thông tin liên quan nếu cần
      // include: [
      //   { model: Address, as: 'addresses' },
      //   { model: Order, as: 'orders' }
      // ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error("Get profile detail error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// Route để thay đổi password
router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới"
      });
    }
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await user.validPassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không chính xác"
      });
    }
    
    // Cập nhật mật khẩu mới
    await user.update({ password: newPassword });
    
    res.json({
      success: true,
      message: "Đổi mật khẩu thành công"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});



export default router;