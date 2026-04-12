import userRepository from "../repositories/user.repository.js";

class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateProfile(userId, fullName, phone) {
    const fieldsToUpdate = {};
    if (fullName) fieldsToUpdate.full_name = fullName;
    if (phone) fieldsToUpdate.phone = phone;

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("Không có trường nào được cập nhật");
    }

    return await userRepository.update(userId, fieldsToUpdate);
  }

  async updateVipStatus(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate total spent from completed orders
    const db = await import("../../models/index.js").then(m => m.default);
    const totalSpent = await db.sequelize.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE user_id = :user_id AND status = 'COMPLETED'
    `, {
      replacements: { user_id: userId },
      type: db.Sequelize.QueryTypes.SELECT
    });

    const spent = parseFloat(totalSpent[0].total) || 0;
    const isVip = spent >= 100000;

    return await userRepository.update(userId, {
      total_spent: spent,
      is_vip: isVip
    });
  }
}

export default new UserService();
