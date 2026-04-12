import categoryRepository from "../repositories/category.repository.js";
import db from "../../models/index.js";

class CategoryService {
  async getAllCategories() {
    const categories = await categoryRepository.findAll({
      include: [
        {
          model: db.Category,
          as: "parent",
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });

    // Add product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        let productCount = 0;
        let totalSold = 0;

        // Nếu là danh mục cha (parent_id = null)
        if (!cat.parent_id) {
          // Count products từ danh mục cha + tất cả danh mục con
          const [result] = await db.sequelize.query(`
            SELECT COUNT(DISTINCT p.id) as count
            FROM products p
            WHERE p.category_id = :category_id
            OR p.category_id IN (
              SELECT id FROM categories WHERE parent_id = :category_id
            )
          `, {
            replacements: { category_id: cat.id },
            type: db.Sequelize.QueryTypes.SELECT
          });
          productCount = parseInt(result.count) || 0;

          // Sum sold quantity từ danh mục cha + con
          const [soldResult] = await db.sequelize.query(`
            SELECT COALESCE(SUM(oi.quantity), 0) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE (p.category_id = :category_id
              OR p.category_id IN (
                SELECT id FROM categories WHERE parent_id = :category_id
              ))
            AND oi.order_id IN (
              SELECT id FROM orders WHERE status = 'COMPLETED'
            )
          `, {
            replacements: { category_id: cat.id },
            type: db.Sequelize.QueryTypes.SELECT
          });
          totalSold = parseInt(soldResult.total_sold) || 0;
        } else {
          // Nếu là danh mục con - chỉ count sản phẩm của danh mục này
          const [result] = await db.sequelize.query(`
            SELECT COUNT(DISTINCT p.id) as count
            FROM products p
            WHERE p.category_id = :category_id
          `, {
            replacements: { category_id: cat.id },
            type: db.Sequelize.QueryTypes.SELECT
          });
          productCount = parseInt(result.count) || 0;

          // Sum sold quantity
          const [soldResult] = await db.sequelize.query(`
            SELECT COALESCE(SUM(oi.quantity), 0) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE p.category_id = :category_id
            AND oi.order_id IN (
              SELECT id FROM orders WHERE status = 'COMPLETED'
            )
          `, {
            replacements: { category_id: cat.id },
            type: db.Sequelize.QueryTypes.SELECT
          });
          totalSold = parseInt(soldResult.total_sold) || 0;
        }

        return {
          ...cat.toJSON(),
          product_count: productCount,
          sold_count: totalSold,
        };
      })
    );

    return categoriesWithCounts;
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
