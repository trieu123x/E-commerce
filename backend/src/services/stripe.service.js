import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

class StripeService {
  /**
   * Create a Stripe Checkout Session
   * @param {Object} order - Order model instance
   * @returns {Object} - The checkout session object
   */
  async createCheckoutSession(order) {
    try {
      const amount = Math.round(parseFloat(order.total_amount));
      console.log(`[Stripe] Creating session: Order #${order.id}, Amount: ${amount} VND`);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name: `Order #${order.id}`,
                description: `Payment for order ${order.id} at E-commerce Store`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/completed?orderId=${order.id}`,
        cancel_url: `http://localhost:3000/fail?orderId=${order.id}`,
        metadata: {
          orderId: order.id.toString(),
        },
      });

      return session;
    } catch (error) {
      console.error("Stripe Checkout Session Error:", error);
      throw error;
    }
  }

  /**
   * Construct and verify Stripe Webhook event
   * @param {Buffer} rawBody - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} - The verified event object
   */
  verifyWebhook(rawBody, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (err) {
      console.error("Stripe Webhook Verification Error:", err.message);
      throw err;
    }
  }
}

export default new StripeService();
