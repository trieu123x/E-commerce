import express from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
    updateCategory,
  checkDeleteCategory
} from "../../controllers/category.controller.js";


const router = express.Router();
// Check delete category by ID
router.get("/:id/check-delete", checkDeleteCategory);
// Create a new category
router.post("/", createCategory);
// Get all categories
router.get("/", getAllCategories);
// Get category by ID
router.get("/:id", getCategoryById);
// Update category by ID
router.put("/:id", updateCategory);
// Delete category by ID
router.delete("/:id", deleteCategory);


export default router;

