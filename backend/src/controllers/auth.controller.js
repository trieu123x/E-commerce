import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { Sequelize } from "sequelize";

export const register = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password ||!fullName)
    return res.status(400).json({ messsage: "Thiếu thông tin" });
  const existingUser = await db.query(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    return res.status(409).json({ message: "Email đã được sử dụng" });
  }
  const hashesPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    `
        INSERT INTO users(email,password_hash,full_name)
        VALUES ($1,$2,$3) RETURNING id,email,full_name,role
        `,
    [email, hashesPassword, fullName],
  );

  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
    user: result.rows[0],
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }

  if (user.status === "LOCKED") {
    return res.status(403).json({ message: "Tài khoản bị khóa" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      fullName: user.full_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ 
            success: true,
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,  
              role: user.role,
              phone: user.phone,
                created_at: user.created_at,
            }
        });
};

export const me = async (req, res) => {
  const result = await db.query(
    `SELECT id, email, full_name, role, phone, created_at 
     FROM users 
     WHERE id = $1`,
    [req.user.id]
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    phone: user.phone,
    createdAt: user.created_at,
  });
};

export const updateProfile = async (req, res) => {
  const { fullName, phone } = req.body;
  const fieldsToUpdate = {};
  if (fullName) fieldsToUpdate.full_name = fullName;
  if (phone) fieldsToUpdate.phone = phone;
  
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: "Không có trường nào được cập nhật" });
  }

  const setClause = Object.keys(fieldsToUpdate)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(fieldsToUpdate);
  values.push(req.user.id);

  const result = await db.query(
    `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING id, email, full_name, phone`,
    values
  );

  res.json({
    success: true,
    message: "Cập nhật hồ sơ thành công",
    user: result.rows[0],
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await db.query(`SELECT password_hash FROM users WHERE id = $1`, [
    req.user.id,
  ]);
  const user = result.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
  }
  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
    newHashedPassword,
    req.user.id,
  ]);
  res.json({ success: true, message: "Đổi mật khẩu thành công" });
};