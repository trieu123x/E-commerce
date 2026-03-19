import express from "express";
import {
  createSale,
  getSales,
  getSaleDetail,
  updateSale,
  deleteSale,
  addProductToSale,
  getActiveSales,
  removeProductFromSale
} from "../controllers/sale.controller.js";

const router = express.Router();


router.get("/", getSales);
router.get("/active", getActiveSales)
router.get("/:id", getSaleDetail);


export default router;