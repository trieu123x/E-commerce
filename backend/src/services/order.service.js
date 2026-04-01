import db from "../../models/index.js";

/**
 * Service to handle order-related operations
 */
class OrderService {
  /**
   * Mark an order as completed (payment success)
   * @param {string|number} orderId 
   */
  async completeOrder(orderId) {
    try {
      await db.Order.update(
        { status: "COMPLETED" },
        { where: { id: orderId } }
      );
      console.log(`Order ${orderId} marked as COMPLETED`);
      return { success: true };
    } catch (error) {
      console.error(`Error completing order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Mark an order as cancelled and restore product stock (payment fail/cancel)
   * @param {string|number} orderId 
   */
  async cancelOrder(orderId) {
    const transaction = await db.sequelize.transaction();
    try {
      // 1. Check current status, only cancel if it's pending
      const order = await db.Order.findByPk(orderId, {
        include: [{ model: db.OrderItem, as: "items" }],
        transaction
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === "CANCELLED") {
        await transaction.rollback();
        return { success: true, message: "Order already cancelled" };
      }

      // 2. Update status to cancelled
      await order.update({ status: "CANCELLED" }, { transaction });

      // 3. Restore stock for each item
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          const product = await db.Product.findByPk(item.product_id, { transaction });
          if (product) {
            await product.increment("stock", { by: item.quantity, transaction });
            console.log(`Restored stock for product ${product.id}: +${item.quantity}`);
          }
        }
      }

      await transaction.commit();
      console.log(`Order ${orderId} marked as CANCELLED and stock restored`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }
}

export default new OrderService();
