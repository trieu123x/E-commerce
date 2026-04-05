import reviewRepository from "../repositories/review.repository.js";
import db from "../../models/index.js";

class ReviewService {
  async getReviewsByProductId(productId, query = {}) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const reviews = await reviewRepository.findAll({
      where: { product_id: productId },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    const total = await reviewRepository.count({ where: { product_id: productId } });

    return {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createReview(userId, data) {
    const { product_id, rating, comment } = data;

    // Check purchase
    const hasPurchased = await reviewRepository.hasPurchased(userId, product_id);
    if (!hasPurchased) {
      throw new Error("Bạn chỉ có thể đánh giá sản phẩm đã mua");
    }

    // Check existing
    const existing = await reviewRepository.findOne({
      where: { product_id, user_id: userId },
    });
    if (existing) {
      throw new Error("Bạn đã đánh giá sản phẩm này rồi");
    }

    const review = await reviewRepository.create({
      product_id,
      user_id: userId,
      rating,
      comment,
    });

    return await reviewRepository.findWithUser(review.id);
  }

  async updateReview(userId, reviewId, data) {
    const { rating, comment } = data;
    const review = await reviewRepository.findByIdAndUser(reviewId, userId);
    if (!review) {
      throw new Error("Review not found or unauthorized");
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    review.created_at = new Date(); // Original code has create_at = new Date()

    await review.save();
    return review;
  }

  async deleteReview(userId, reviewId) {
    const review = await reviewRepository.findByIdAndUser(reviewId, userId);
    if (!review) {
      throw new Error("Review not found or unauthorized");
    }
    await review.destroy();
    return true;
  }

  async getReviewsByUser(userId) {
    return await reviewRepository.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "name", "price"],
        },
      ],
    });
  }
}

export default new ReviewService();
