import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

console.log("Key:", process.env.STRIPE_SECRET_KEY);

try {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("Stripe initialized");
  
  // Try to create a session with dummy data to see the specific Stripe error
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "vnd",
        product_data: { name: "Test" },
        unit_amount: 10000,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  console.log("Session created:", session.id);
} catch (error) {
  console.error("Stripe Error Catch:", error.message);
  console.error("Error Code:", error.code);
}
