import express from 'express';
import {
  createMomoPayment,
  momoReturn,
  momoIPN
} from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// API tạo thanh toán MoMo (cần login)
router.post('/momo/create', authMiddleware, createMomoPayment);

// redirect về frontend sau khi thanh toán
router.get('/momo/return', momoReturn);

// webhook từ MoMo (KHÔNG cần auth)
router.post('/momo/ipn', momoIPN);

export default router;