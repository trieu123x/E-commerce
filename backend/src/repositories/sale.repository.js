import db from "../../models/index.js";
import { Op } from "sequelize";

const { Sale, Product, ProductImage, ProductSale } = db;

class SaleRepository {
  async create(data) {
    return await Sale.create(data);
  }

  async findAll() {
    return await Sale.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  async findById(id) {
    return await Sale.findByPk(id, {
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price"],
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["image_url"],
              where: { is_main: true },
              required: false,
            },
          ],
          through: { attributes: [] },
        },
      ],
    });
  }

  async update(id, data) {
    const sale = await Sale.findByPk(id);
    if (!sale) return null;
    return await sale.update(data);
  }

  async delete(id) {
    const sale = await Sale.findByPk(id);
    if (!sale) return false;
    await sale.destroy();
    return true;
  }

  async getActiveSales(now) {
    return await Sale.findAll({
      where: {
        is_active: true,
        start_date: { [Op.lte]: now },
        end_date: { [Op.gte]: now },
      },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price"],
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["image_url"],
              where: { is_main: true },
              required: false,
            },
          ],
          through: { attributes: [] },
        },
      ],
    });
  }

  async addProductsToSale(saleId, productIds) {
    const data = productIds.map((productId) => ({
      sale_id: saleId,
      product_id: productId,
    }));
    return await ProductSale.bulkCreate(data, {
      ignoreDuplicates: true,
    });
  }

  async removeProductFromSale(saleId, productId) {
    return await ProductSale.destroy({
      where: {
        sale_id: saleId,
        product_id: productId,
      },
    });
  }
}

export default new SaleRepository();
