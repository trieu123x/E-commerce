import db from "../../models/index.js";

const { Order, OrderItem, Product, ProductImage, Payment, User } = db;

class OrderRepository {
  async findByPk(id, options = {}) {
    return await Order.findByPk(id, options);
  }

  async findOne(options = {}) {
    return await Order.findOne(options);
  }

  async findAll(options = {}) {
    return await Order.findAll(options);
  }

  async count(options = {}) {
    return await Order.count(options);
  }

  async create(data, options = {}) {
    return await Order.create(data, options);
  }

  async createOrderItem(data, options = {}) {
    return await OrderItem.create(data, options);
  }

  async bulkCreateOrderItems(data, options = {}) {
    return await OrderItem.bulkCreate(data, options);
  }

  async createPayment(data, options = {}) {
    return await Payment.create(data, options);
  }

  async updatePayment(data, options = {}) {
    return await Payment.update(data, options);
  }

  async update(data, options = {}) {
    return await Order.update(data, options);
  }
}

export default new OrderRepository();
