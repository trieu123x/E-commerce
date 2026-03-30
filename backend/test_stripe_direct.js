import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

console.log("Key starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 8));

try {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "vnd",
        product_data: { name: "Test Order" },
        unit_amount: 100000,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: "http://localhost:3000/completed",
    cancel_url: "http://localhost:3000/fail",
    metadata: { orderId: "77" },
  });
  console.log("SESSION URL:", session.url);
} catch (err) {
  console.error("=== STRIPE ERROR ===");
  console.error("Type:", err.type);
  console.error("Code:", err.code);
  console.error("Message:", err.message);
  console.error("Status:", err.statusCode);
}
