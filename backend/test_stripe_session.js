import axios from 'axios';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 11, email: 'user@example.com', role: 'user', fullName: 'Test User' }, 'super_secret_key');

async function testStripeSession() {
  try {
    console.log("Creating Stripe Session for order 77...");
    const stripeRes = await axios.post('http://localhost:5000/api/payment/stripe/create', {
      orderId: 77
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success:", stripeRes.data);
  } catch (err) {
    console.error("HTTP Status:", err.response?.status);
    console.error("Full Error Data:", JSON.stringify(err.response?.data, null, 2));
  }
}

testStripeSession();
