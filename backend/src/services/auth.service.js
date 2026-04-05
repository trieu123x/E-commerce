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
}

export default new AuthService();
