import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import db from './models/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

// Simulate exactly what the controller does
const order = await db.Order.findByPk(77);
if (!order) {
  console.error("Order 77 not found!");
  process.exit(1);
}

console.log("Order data:", {
  id: order.id,
  total_amount: order.total_amount,
  type: typeof order.total_amount,
  rounded: Math.round(order.total_amount),
});

try {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "vnd",
        product_data: {
          name: `Order #${order.id}`,
          description: `Payment for order ${order.id} at E-commerce Store`,
        },
        unit_amount: Math.round(order.total_amount),
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `http://localhost:3000/completed?orderId=${order.id}`,
    cancel_url: `http://localhost:3000/fail?orderId=${order.id}`,
    metadata: { orderId: order.id.toString() },
  });
  console.log("✅ SUCCESS! Session URL:", session.url);
} catch (err) {
  console.error("❌ STRIPE ERROR:");
  console.error("Message:", err.message);
  console.error("Type:", err.type);
  console.error("Code:", err.statusCode);
}

process.exit(0);
