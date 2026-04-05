import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";

class AuthService {
  async register({ email, password, fullName }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email,
      password_hash: hashedPassword,
      full_name: fullName,
    });

    return user;
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Sai email hoặc mật khẩu");
    }

    if (user.status === "LOCKED") {
      throw new Error("Tài khoản bị khóa");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Sai email hoặc mật khẩu");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        fullName: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        created_at: user.created_at,
      },
    };
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // userRepository.findById doesn't return password_hash for safety, but we need it for comparison
    // Let's create a specialized method in userRepository if needed, or modify findById
    // Actually, inUserRepository.findByEmail returns everything.
    const userWithHash = await userRepository.findByEmail(user.email);
    const isMatch = await bcrypt.compare(currentPassword, userWithHash.password_hash);
    if (!isMatch) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(userId, newHashedPassword);
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Vì lý do bảo mật, không báo là email không tồn tại
      // Nhưng ở đây mình có thể báo lỗi nếu cần
      throw new Error("Email không tồn tại trong hệ thống");
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const { sendResetEmail } = await import("./mail.service.js");
    await sendResetEmail(email, resetLink);

    return { message: "Link đặt lại mật khẩu đã được gửi đến email của bạn" };
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== "reset_password") {
        throw new Error("Token không hợp lệ");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updatePassword(decoded.id, hashedPassword);

      return { success: true, message: "Đặt lại mật khẩu thành công" };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Link đã hết hạn");
      }
      throw new Error("Link không hợp lệ hoặc đã được sử dụng");
    }
  }
}

export default new AuthService();
