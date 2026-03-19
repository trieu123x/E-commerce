import db from "../../models/index.js";

export const createCategory = async (req, res) => { 
    try {
        const { name, parent_id } = req.body;
        const category = await db.Category.create({ name, parent_id });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getAllCategories = async (req, res) => { 
    try {
        const categories =  await db.Category.findAll({
            include: [{
                model: db.Category,
                as: 'parent',
                attributes: ['id', 'name']
            }]
        });
        res.status(200).json({
            success: true,
            categories: categories
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await db.Category.findByPk(id, {
            include: [{
                model: db.Category,
                as: 'parent',
                attributes: ['id', 'name']
            }]
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parent_id } = req.body;
        const category = await db.Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        category.name = name || category.name;
        category.parent_id = parent_id || category.parent_id;
        await category.save();
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const deleteCategory = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { move_to_category_id } = req.body; // ID category mới để chuyển sản phẩm
    
    const category = await db.Category.findByPk(id, { transaction });
    
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Kiểm tra xem có danh mục con không
    const childrenCount = await db.Category.count({
      where: { parent_id: id },
      transaction
    });
    
    if (childrenCount > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục có chứa danh mục con'
      });
    }
    
    // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
    const productsCount = await db.Product.count({
      where: { category_id: id },
      transaction
    });
    
    if (productsCount > 0) {
      // Nếu có sản phẩm, yêu cầu chuyển sang category khác
      if (!move_to_category_id) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Danh mục có ${productsCount} sản phẩm. Vui lòng chọn danh mục khác để chuyển sản phẩm trước khi xóa.`,
          products_count: productsCount
        });
      }
      
      // Kiểm tra category mới có tồn tại không
      const newCategory = await db.Category.findByPk(move_to_category_id, { transaction });
      if (!newCategory) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Danh mục chuyển đến không tồn tại'
        });
      }
      
      // Không cho phép chuyển đến chính nó
      if (move_to_category_id == id) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể chuyển sản phẩm đến chính danh mục này'
        });
      }
      
      // Chuyển tất cả sản phẩm sang category mới
      await db.Product.update(
        { category_id: move_to_category_id },
        {
          where: { category_id: id },
          transaction
        }
      );
      
      console.log(`Đã chuyển ${productsCount} sản phẩm từ category ${id} sang ${move_to_category_id}`);
    }
    
    await category.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: productsCount > 0 
        ? `Đã xóa danh mục và chuyển ${productsCount} sản phẩm sang danh mục khác`
        : 'Xóa danh mục thành công'
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Delete category error:', error);
    
    // Xử lý lỗi foreign key constraint
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục vì còn sản phẩm đang sử dụng. Vui lòng chuyển sản phẩm sang danh mục khác trước.',
        error_code: 'CATEGORY_HAS_PRODUCTS'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa danh mục'
    });
  }
};

export const checkDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await db.Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        const childrenCount = await db.Category.count({ where: { parent_id: id } });
        const productsCount = await db.Product.count({ where: { category_id: id } });
        res.status(200).json({
            success: true,
            children_count: childrenCount,
            products_count: productsCount
        });
    } catch (error) {
        console.error("Error checking category deletion:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getParentCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      where: { parent_id: null },
      attributes: ['id', 'name']
    });
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}