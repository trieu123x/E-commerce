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
}

export default new UserService();
