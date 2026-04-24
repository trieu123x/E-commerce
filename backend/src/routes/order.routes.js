import express from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { buyNow, getOrderDetails, getOrdersByUserId, getPaymentStatistics } from '../controllers/order.controller.js';
const router = express.Router()
router.use(authMiddleware)

router.post("/", buyNow)
router.get("/your-order", getOrdersByUserId)
router.get("/your-order/:id", getOrderDetails)
router.get("/payment-statistics", getPaymentStatistics)

export default router