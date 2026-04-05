import wishlistService from "../services/wishlist.service.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistService.getWishlist(userId);
    res.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách yêu thích",
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    await wishlistService.addToWishlist(userId, productId);
    res.status(201).json({
      success: true,
      message: "Đã thêm vào danh sách yêu thích",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    if (error.message === "Sản phẩm đã có trong danh sách yêu thích") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm vào danh sách yêu thích",
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await wishlistService.removeFromWishlist(userId, productId);
    res.json({
      success: true,
      message: "Đã xóa khỏi danh sách yêu thích",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    if (error.message === "Sản phẩm không có trong danh sách yêu thích") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa khỏi danh sách yêu thích",
    });
  }
};

export const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const isInWishlist = await wishlistService.checkWishlistStatus(userId, productId);
    res.json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra trạng thái yêu thích",
    });
  }
};