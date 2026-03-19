import { where } from "sequelize";
import db from "../../models/index.js";

const { Sale, Product, ProductSale, Sequelize, ProductImage } = db;
const { Op } = Sequelize;

/*
========================
CREATE SALE
========================
*/
export const createSale = async (req, res) => {
  try {
    const {
      name,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    } = req.body;
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }
    const sale = await Sale.create({
      name,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    });

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error("Create sale error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/*
========================
GET ALL SALES
========================
*/
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error("Get sales error:", error);
    res.status(500).json({ success: false });
  }
};

/*
========================
GET SALE DETAIL
========================
*/
export const getSaleDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id, {
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

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const products = sale.products.map((p) => {
      let price_after = p.price;

      if (sale.discount_type === "percent") {
        price_after = p.price - (p.price * sale.discount_value) / 100;
      }

      if (sale.discount_type === "fixed") {
        price_after = p.price - sale.discount_value;
      }

      return {
        ...p.toJSON(),
        price_after,
      };
    });

    res.json({
      success: true,
      data: {
        ...sale.toJSON(),
        products,
      },
    });
  } catch (error) {
    console.error("Get sale detail error:", error);
    res.status(500).json({ success: false });
  }
};

/*
========================
UPDATE SALE
========================
*/
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    await sale.update(req.body);

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error("Update sale error:", error);
    res.status(500).json({ success: false });
  }
};

/*
========================
DELETE SALE
========================
*/
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
      });
    }

    await sale.destroy();

    res.json({
      success: true,
      message: "Sale deleted",
    });
  } catch (error) {
    console.error("Delete sale error:", error);
    res.status(500).json({ success: false });
  }
};

/*
========================
ADD PRODUCT TO SALE
========================
*/
export const addProductToSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { productIds } = req.body;

    const sale = await Sale.findByPk(saleId);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const data = productIds.map((productId) => ({
      sale_id: saleId,
      product_id: productId,
    }));

    await ProductSale.bulkCreate(data, {
      ignoreDuplicates: true,
    });

    res.json({
      success: true,
      message: "Products added to sale",
    });
  } catch (error) {
    console.error("Add product sale error:", error);
    res.status(500).json({ success: false });
  }
};
export const getActiveSales = async (req, res) => {
  try {
    const now = new Date();

    const sales = await Sale.findAll({
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

    const formattedSales = sales.map((sale) => {
      const products = sale.products.map((p) => {
        let price_after = p.price;

        if (sale.discount_type === "percent") {
          price_after = p.price - (p.price * sale.discount_value) / 100;
        }

        if (sale.discount_type === "fixed") {
          price_after = p.price - sale.discount_value;
        }

        return {
          ...p.toJSON(),
          price_after,
        };
      });

      return {
        ...sale.toJSON(),
        products,
      };
    });

    res.json({
      success: true,
      data: formattedSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
export const removeProductFromSale = async (req, res) => {
  try {
    const { saleId, productId } = req.params;

    await ProductSale.destroy({
      where: {
        sale_id: saleId,
        product_id: productId,
      },
    });

    res.json({
      success: true,
      message: "Product removed from sale",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
