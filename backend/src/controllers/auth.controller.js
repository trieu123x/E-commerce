import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";

export const register = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName)
    return res.status(400).json({ message: "Thiếu thông tin" });

  try {
    const user = await authService.register({ email, password, fullName });
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user,
    });
  } catch (error) {
    if (error.message === "Email đã được sử dụng") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.login({ email, password });
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      ...result,
    });
  } catch (error) {
    if (
      error.message === "Sai email hoặc mật khẩu" ||
      error.message === "Tài khoản bị khóa"
    ) {
      const status = error.message === "Tài khoản bị khóa" ? 403 : 401;
      return res.status(status).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, phone } = req.body;

  try {
    const user = await userService.updateProfile(req.user.id, fullName, phone);
    res.json({
      success: true,
      message: "Cập nhật hồ sơ thành công",
      user,
    });
  } catch (error) {
    if (error.message === "Không có trường nào được cập nhật") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    await authService.changePassword(req.user.id, {
      currentPassword,
      newPassword,
    });
    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Mật khẩu hiện tại không đúng") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};