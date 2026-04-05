import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(authMiddleware);

// Lấy danh sách yêu thích của người dùng
router.get("/", getWishlist);
// Thêm sản phẩm vào danh sách yêu thích
router.post("/", addToWishlist);
// Xóa sản phẩm khỏi danh sách yêu thích
router.delete("/:product_id", removeFromWishlist);

// Kiểm tra trạng thái yêu thích
router.get("/check/:product_id", checkWishlistStatus);
export default router;

