import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", removeFromCart);
router.delete("/clear", clearCart);
router.get("/count", getCartCount);

export default router;