import saleRepository from "../repositories/sale.repository.js";

class SaleService {
  async createSale(data) {
    if (new Date(data.start_date) >= new Date(data.end_date)) {
      throw new Error("End date must be after start date");
    }
    return await saleRepository.create(data);
  }

  async getAllSales() {
    return await saleRepository.findAll();
  }

  async getSaleById(id) {
    const sale = await saleRepository.findById(id);
    if (!sale) throw new Error("Sale not found");

    const products = sale.products?.map((p) => {
      let price_after = p.price;
      if (sale.discount_type === "percent") {
        price_after = p.price - (p.price * sale.discount_value) / 100;
      } else if (sale.discount_type === "fixed") {
        price_after = p.price - sale.discount_value;
      }
      return { ...p.toJSON(), price_after };
    }) || [];

    return { ...sale.toJSON(), products };
  }

  async updateSale(id, data) {
    const sale = await saleRepository.update(id, data);
    if (!sale) throw new Error("Sale not found");
    return sale;
  }

  async deleteSale(id) {
    const success = await saleRepository.delete(id);
    if (!success) throw new Error("Sale not found");
    return true;
  }

  async getActiveSales() {
    const now = new Date();
    const sales = await saleRepository.getActiveSales(now);

    return sales.map((sale) => {
      const products = sale.products?.map((p) => {
        let price_after = p.price;
        if (sale.discount_type === "percent") {
          price_after = p.price - (p.price * sale.discount_value) / 100;
        } else if (sale.discount_type === "fixed") {
          price_after = p.price - sale.discount_value;
        }
        return { ...p.toJSON(), price_after };
      }) || [];
      return { ...sale.toJSON(), products };
    });
  }

  async addProductToSale(saleId, productIds) {
    // If productIds is not an array, make it one
    const ids = Array.isArray(productIds) ? productIds : [productIds];
    const result = await saleRepository.addProductsToSale(saleId, ids);
    if (!result) throw new Error("Sale not found");
    return result;
  }

  async removeProductFromSale(saleId, productId) {
    return await saleRepository.removeProductFromSale(saleId, productId);
  }
}

export default new SaleService();
