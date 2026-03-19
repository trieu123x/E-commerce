import express from "express";
import { getAllProducts,getProductById } from "../controllers/products.controller.js";
import * as reviewController from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Routes for reviews
router.post("/:product_id/reviews", authMiddleware, reviewController.createReview);
router.put("/:product_id/reviews/:review_id", authMiddleware, reviewController.updateReview);
router.get("/:product_id/reviews", reviewController.getReviewsByProduct);
router.delete("/reviews/:review_id", authMiddleware, reviewController.deleteReview);
 



export default router;
