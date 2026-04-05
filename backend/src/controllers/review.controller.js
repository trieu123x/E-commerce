import reviewService from "../services/review.service.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await reviewService.createReview(userId, {
      ...req.body,
      product_id: req.params.product_id || req.body.product_id
    });
    res.json({
      success: true,
      message: "Đã tạo đánh giá thành công",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    const status = error.message.includes("đã mua") ? 403 : (error.message.includes("đã đánh giá") ? 400 : 500);
    res.status(status).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await reviewService.getReviewsByProductId(product_id, req.query);
    res.json({
      success: true,
      reviews: result.reviews,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const userId = req.user.id;
    await reviewService.deleteReview(userId, review_id);
    res.json({
      success: true,
      message: "Đã xóa đánh giá thành công",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const userId = req.user.id;
    const review = await reviewService.updateReview(userId, review_id, req.body);
    res.json({
      success: true,
      message: "Đã cập nhật đánh giá thành công",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// Aliases for compatibility if needed
export const getProductReviews = getReviewsByProduct;