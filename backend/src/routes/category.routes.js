 import express from "express";
import {
  getAllCategories,
  getCategoryById,
  getParentCategories

} from "../controllers/category.controller.js";


const router = express.Router();

// Get all categories
router.get("/", getAllCategories);
// Get parent categories
router.get("/parents", getParentCategories);
// Get category by ID
router.get("/:id", getCategoryById);




export default router;

