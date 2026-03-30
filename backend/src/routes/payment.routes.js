import express from 'express';
import {
  createMomoPayment,
  momoReturn,
  momoIPN,
  createVnpayPayment,
  vnpayReturn,
  vnpayIPN,
  createStripePayment,
  stripeWebhook
} from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// API tạo thanh toán MoMo (cần login)
router.post('/momo/create', authMiddleware, createMomoPayment);

// redirect về frontend sau khi thanh toán
router.get('/momo/return', momoReturn);

// webhook từ MoMo (KHÔNG cần auth)
router.post('/momo/ipn', momoIPN);

// VNPay routes
router.post('/vnpay/create', authMiddleware, createVnpayPayment);
router.get('/vnpay/return', vnpayReturn);
router.get('/vnpay/ipn', vnpayIPN);

// Stripe routes
router.post('/stripe/create', authMiddleware, createStripePayment);
router.post('/stripe/webhook', stripeWebhook);

export default router;