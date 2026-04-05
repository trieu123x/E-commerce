import categoryRepository from "../repositories/category.repository.js";
import db from "../../models/index.js";

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.findAll({
      include: [
        {
          model: db.Category,
          as: "parent",
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findByPk(id, {
      include: [
        {
          model: db.Category,
          as: "parent",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!category) throw new Error("Category not found");
    return category;
  }

  async createCategory(name, parent_id) {
    return await categoryRepository.create({ name, parent_id });
  }

  async updateCategory(id, data) {
    const category = await categoryRepository.update(id, data);
    if (!category) throw new Error("Category not found");
    return category;
  }

  async deleteCategory(id, move_to_category_id) {
    const transaction = await db.sequelize.transaction();
    try {
      const category = await categoryRepository.findByPk(id, { transaction });
      if (!category) throw new Error("Category not found");

      // Check for children
      const childrenCount = await categoryRepository.count({
        where: { parent_id: id },
        transaction,
      });
      if (childrenCount > 0) {
        throw new Error("Không thể xóa danh mục có chứa danh mục con");
      }

      // Check for products
      const productsCount = await db.Product.count({
        where: { category_id: id },
        transaction,
      });

      if (productsCount > 0) {
        if (!move_to_category_id) {
          throw new Error(`CATEGORY_HAS_PRODUCTS:${productsCount}`);
        }

        if (move_to_category_id == id) {
          throw new Error("Không thể chuyển sản phẩm đến chính danh mục này");
        }

        const newCategory = await categoryRepository.findByPk(move_to_category_id, { transaction });
        if (!newCategory) throw new Error("Danh mục chuyển đến không tồn tại");

        // Move products
        await db.Product.update(
          { category_id: move_to_category_id },
          { where: { category_id: id }, transaction }
        );
      }

      await category.destroy({ transaction });
      await transaction.commit();
      return productsCount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async checkDeleteCategory(id) {
    const category = await categoryRepository.findByPk(id);
    if (!category) throw new Error("Category not found");

    const childrenCount = await categoryRepository.count({ where: { parent_id: id } });
    const productsCount = await db.Product.count({ where: { category_id: id } });

    return { childrenCount, productsCount };
  }

  async getParentCategories() {
    return await categoryRepository.findAll({
      where: { parent_id: null },
      attributes: ["id", "name"],
    });
  }
}

export default new CategoryService();
