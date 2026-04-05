import express from "express";
import { register, login, me, updateProfile, changePassword, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/me", authMiddleware, me)

export default router