import db from "../../models/index.js";

const { Sequelize } = db;

class CategoryRepository {
  async findAll(options = {}) {
    return await db.Category.findAll(options);
  }

  async findByPk(id, options = {}) {
    return await db.Category.findByPk(id, options);
  }

  async create(data, options = {}) {
    return await db.Category.create(data, options);
  }

  async update(id, data, options = {}) {
    const category = await db.Category.findByPk(id, options);
    if (!category) return null;
    return await category.update(data, options);
  }

  async count(options = {}) {
    return await db.Category.count(options);
  }

  async delete(id, options = {}) {
    const category = await db.Category.findByPk(id, options);
    if (!category) return false;
    await category.destroy(options);
    return true;
  }
}

export default new CategoryRepository();
