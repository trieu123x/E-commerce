import db from "../../models/index.js";
export const createReview = async (req, res) => {
  try {
    const { product_id } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const { Review, Order, OrderItem, User } = db;

    // 1️⃣ Kiểm tra user đã mua sản phẩm chưa
    const hasPurchased = await OrderItem.findOne({
      where: { product_id },
      include: [
        {
          model: Order,
          as: "order",
          where: { user_id: userId },
          attributes: []
        }
      ]
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể đánh giá sản phẩm đã mua"
      });
    }

    // 2️⃣ Kiểm tra user đã review chưa
    const existingReview = await Review.findOne({
      where: {
        product_id,
        user_id: userId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi"
      });
    }

    // 3️⃣ Tạo review
    const newReview = await Review.create({
      product_id,
      user_id: userId,
      rating,
      comment
    });

    // 4️⃣ Lấy review kèm user
    const reviewWithUser = await Review.findOne({
      where: { id: newReview.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"]
        }
      ]
    });

    res.json({
      success: true,
      message: "Đã tạo đánh giá thành công",
      review: reviewWithUser
    });

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};

export const getReviewsByProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const reviews = await db.Review.findAll({
            where: { product_id },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });
        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { review_id } = req.params;
        const review = await db.Review.findOne({
            where: { id: review_id, user_id: userId }
        });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Đánh giá không tồn tại hoặc bạn không có quyền xóa"
            });
        }
        await review.destroy();
        res.json({
            success: true,
            message: "Đã xóa đánh giá thành công"
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
}

export const updateReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { review_id } = req.params;
        const { rating, comment } = req.body;
        const review = await db.Review.findOne({
            where: { id: review_id, user_id: userId }
        });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Đánh giá không tồn tại hoặc bạn không có quyền sửa"
            });
        }
        review.rating = rating !== undefined ? rating : review.rating;
        review.comment = comment !== undefined ? comment : review.comment;
        review.create_at = new Date();
        await review.save();
        res.json({
            success: true,
            message: "Đã cập nhật đánh giá thành công",
            review
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
}

export const getReviewsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await db.Review.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price']
                }
            ]
        });
        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({      
            success: false,
            message: "Lỗi server"
        });
    }
}