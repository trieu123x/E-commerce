import express from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { buyNow, getOrderDetails, getOrdersByUserId, } from '../controllers/order.controller.js';
const router = express.Router()
router.use(authMiddleware)

router.post("/", buyNow)
router.get("/your-order", getOrdersByUserId)
router.get("/your-order/:id", getOrderDetails)

export default router