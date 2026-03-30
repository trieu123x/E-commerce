import axios from 'axios';

async function testStripeCreate() {
  try {
    const res = await axios.post('http://localhost:5000/api/payment/stripe/create', {
      orderId: 68 // Use an ID that exists based on user logs
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error Status:", err.response?.status);
    console.error("Error Data:", err.response?.data);
  }
}

testStripeCreate();
