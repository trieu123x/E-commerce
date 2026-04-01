import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import axios from 'axios';

const token = jwt.sign({ id: 11, email: 'user@example.com', role: 'user', fullName: 'Test' }, process.env.JWT_SECRET || 'super_secret_key');

try {
  console.log("Creating order via POST /api/order...");
  const res = await axios.post('http://localhost:5000/api/order', {
    product_id: 12,
    quantity: 1,
    address_id: 2,
    payment_method: 'VNPAY'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log("✅ Success:", JSON.stringify(res.data, null, 2));
} catch (err) {
  console.error("❌ Error Status:", err.response?.status);
  console.error("❌ Error Data:", JSON.stringify(err.response?.data, null, 2));
}
process.exit(0);
