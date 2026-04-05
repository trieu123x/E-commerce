import categoryService from "../services/category.service.js";

export const createCategory = async (req, res) => {
  try {
    const { name, parent_id, parentId } = req.body;
    const final_parent_id = parent_id !== undefined ? parent_id : parentId;
    const category = await categoryService.createCategory(name, final_parent_id);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    const status = error.message === "DB Error" || error.message === "Internal server error" ? 500 : 400;
    res.status(status).json({
      success: false,
      message: status === 500 ? "Internal server error" : (error.message || "Internal server error"),
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    const status = error.message === "Category not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message === "Category not found" ? "Category not found" : "Internal server error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    const status = error.message === "Category not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message === "Category not found" ? "Category not found" : "Internal server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { move_to_category_id } = req.body;
    const productsCount = await categoryService.deleteCategory(id, move_to_category_id);
    
    res.json({
      success: true,
      message: productsCount > 0 
        ? `Đã chuyển ${productsCount} sản phẩm sang danh mục khác và xóa danh mục thành công`
        : "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    if (error.message.startsWith("CATEGORY_HAS_PRODUCTS:")) {
      const count = error.message.split(":")[1];
      return res.status(400).json({
        success: false,
        message: `Danh mß╗Ñc c├│ ${count} sß║ún phß║⌐m. Vui l├▓ng chß╗ìn danh mß╗Ñc kh├íc ─æß╗â chuyß╗ân sß║ún phß║⌐m tr╞░ß╗¢c khi x├│a.`,
        products_count: parseInt(count),
      });
    }
    const status = error.message === "Category not found" ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message || "Lß╗ùi server khi x├│a danh mß╗Ñc",
    });
  }
};

export const checkDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { childrenCount, productsCount } = await categoryService.checkDeleteCategory(id);
    res.status(200).json({
      success: true,
      children_count: childrenCount,
      products_count: productsCount,
    });
  } catch (error) {
    console.error("Error checking category deletion:", error);
    const status = error.message === "Category not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message === "Category not found" ? "Category not found" : "Internal server error",
    });
  }
};

export const getParentCategories = async (req, res) => {
  try {
    const categories = await categoryService.getParentCategories();
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};