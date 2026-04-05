import pool from "../config/db.js";

class UserRepository {
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  }

  async findById(id) {
    const result = await pool.query(
      "SELECT id, email, full_name, role, phone, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  async create({ email, password_hash, full_name }) {
    const result = await pool.query(
      `INSERT INTO users(email, password_hash, full_name)
       VALUES ($1, $2, $3) RETURNING id, email, full_name, role`,
      [email, password_hash, full_name]
    );
    return result.rows[0];
  }

  async update(id, fields) {
    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(fields);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING id, email, full_name, phone`,
      values
    );
    return result.rows[0];
  }

  async updatePassword(id, hashedPassword) {
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashedPassword,
      id,
    ]);
  }

  async findAll() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }
}

export default new UserRepository();
