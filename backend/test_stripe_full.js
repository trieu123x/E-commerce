import axios from 'axios';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 11, email: 'user@example.com', role: 'user', fullName: 'Test User' }, 'super_secret_key');

async function testFullStripeFlow() {
  try {
    console.log("1. Creating Order...");
    const orderRes = await axios.post('http://localhost:5000/api/order', {
      product_id: 12,
      quantity: 1,
      address_id: 2,
      payment_method: 'STRIPE'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const orderId = orderRes.data.data.id;
    console.log("Order Created:", orderId);

    console.log("2. Creating Stripe Session...");
    const stripeRes = await axios.post('http://localhost:5000/api/payment/stripe/create', {
      orderId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Stripe Session Success:", stripeRes.data.payUrl);
  } catch (err) {
    console.error("Error Status:", err.response?.status);
    console.error("Error Data:", JSON.stringify(err.response?.data, null, 2));
    if (!err.response) {
      console.error("No response from server. It might have crashed.");
    }
  }
}

testFullStripeFlow();
