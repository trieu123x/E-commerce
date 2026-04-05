import saleService from "../services/sale.service.js";

export const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale(req.body);
    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error("Create sale error:", error);
    const status = (error.message && error.message.includes("date")) ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error("Get sales error:", error);
    res.status(500).json({ success: false });
  }
};

export const getSaleDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await saleService.getSaleById(id);
    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error("Get sale detail error:", error);
    if (error.message === "Sale not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await saleService.updateSale(id, req.body);
    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error("Update sale error:", error);
    const status = error.message === "Sale not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    await saleService.deleteSale(id);
    res.json({
      success: true,
      message: "Sale deleted",
    });
  } catch (error) {
    console.error("Delete sale error:", error);
    res.status(500).json({ success: false });
  }
};

export const addProductToSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { productIds } = req.body;
    await saleService.addProductToSale(saleId, productIds);
    res.json({
      success: true,
      message: "Products added to sale",
    });
  } catch (error) {
    console.error("Add product sale error:", error);
    const status = (error.message && error.message === "Sale not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const getActiveSales = async (req, res) => {
  try {
    const sales = await saleService.getActiveSales();
    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const removeProductFromSale = async (req, res) => {
  try {
    const { saleId, productId } = req.params;
    await saleService.removeProductFromSale(saleId, productId);
    res.json({
      success: true,
      message: "Product removed from sale",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
