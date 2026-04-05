import productService from "../services/product.service.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    if (error.message === "Sản phẩm không tồn tại") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
