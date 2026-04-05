import cartService from "../services/cart.service.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy giỏ hàng",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    const cartItem = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
      cartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    if (
      error.message === "Sản phẩm không tồn tại hoặc không khả dụng" ||
      error.message === "Số lượng sản phẩm trong kho không đủ"
    ) {
      return res.status(error.message.includes("không tồn tại") ? 404 : 400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sản phẩm vào giỏ hàng",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
    const cartItem = await cartService.updateCartItem(userId, itemId, quantity);
    res.json({
      success: true,
      message: "Đã cập nhật số lượng",
      cartItem,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    if (
      error.message === "Số lượng không hợp lệ" ||
      error.message === "Không tìm thấy sản phẩm trong giỏ hàng" ||
      error.message.includes("Số lượng trong kho không đủ")
    ) {
      const status = error.message === "Không tìm thấy sản phẩm trong giỏ hàng" ? 404 : 400;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật giỏ hàng",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    await cartService.removeFromCart(userId, itemId);
    res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    if (error.message === "Không tìm thấy sản phẩm trong giỏ hàng") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa khỏi giỏ hàng",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedCount = await cartService.clearCart(userId);
    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
      deletedCount: deletedCount,
    });
  } catch (error) {
    console.error(" Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa giỏ hàng",
    });
  }
};

export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await cartService.getCartCount(userId);
    res.json({
      success: true,
      count,
      message:
        count === 0
          ? "Giỏ hàng trống"
          : `Có ${count} sản phẩm trong giỏ`,
    });
  } catch (error) {
    console.error(" Get cart count error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đếm giỏ hàng",
    });
  }
};
