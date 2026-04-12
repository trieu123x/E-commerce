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
    const db = await import("../../models/index.js").then(m => m.default);
    
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate total spent from completed orders - using more explicit query
    const orders = await db.Order.findAll({
      where: {
        user_id: userId,
        status: 'COMPLETED'
      },
      attributes: ['id', 'total_amount'],
      raw: true
    });

    // Sum all order amounts
    const totalSpent = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_amount) || 0);
    }, 0);

    console.log(`[VIP Check] User ${userId}: Total Spent = ${totalSpent}, Is VIP = ${totalSpent >= 100000}`);

    const isVip = totalSpent >= 100000;

    return await userRepository.update(userId, {
      total_spent: totalSpent,
      is_vip: isVip
    });
  }
}

export default new UserService();
