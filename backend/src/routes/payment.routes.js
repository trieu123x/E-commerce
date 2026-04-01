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

// CRITICAL: Webhook route MUST be defined BEFORE JSON middleware
// so express.raw() can capture the raw body for signature verification
router.post('/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhook);

// Apply JSON parser to all OTHER routes
router.use(express.json());

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

export default router;