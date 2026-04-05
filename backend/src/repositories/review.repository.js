import db from "../../models/index.js";

const { Review, User, Product, Order, OrderItem } = db;

class ReviewRepository {
  async findOne(options) {
    return await Review.findOne(options);
  }

  async findAll(options) {
    return await Review.findAll(options);
  }

  async create(data) {
    return await Review.create(data);
  }

  async findByIdAndUser(id, userId) {
    return await Review.findOne({
      where: { id, user_id: userId },
    });
  }

  async count(options) {
    return await Review.count(options);
  }

  async findWithUser(id) {
    return await Review.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
      ],
    });
  }

  async hasPurchased(userId, productId) {
    return await OrderItem.findOne({
      where: { product_id: productId },
      include: [
        {
          model: Order,
          as: "order",
          where: { user_id: userId },
          attributes: [],
        },
      ],
    });
  }
}

export default new ReviewRepository();
