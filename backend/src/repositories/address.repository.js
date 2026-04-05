import db from "../../models/index.js";

const { Address } = db;

class AddressRepository {
  async findAllByUserId(userId) {
    return await Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"]],
    });
  }

  async findByIdAndUser(id, userId, options = {}) {
    return await Address.findOne({
      where: { id, user_id: userId },
      ...options,
    });
  }

  async create(data, options = {}) {
    return await Address.create(data, options);
  }

  async updateAll(userId, data, options = {}) {
    return await Address.update(data, {
      where: { user_id: userId },
      ...options,
    });
  }

  async delete(id, userId, options = {}) {
    return await Address.destroy({
      where: { id, user_id: userId },
      ...options,
    });
  }

  async count(userId, excludedId, options = {}) {
    return await Address.count({
      where: {
        user_id: userId,
        id: { [db.Sequelize.Op.ne]: excludedId },
      },
      ...options,
    });
  }
}

export default new AddressRepository();
