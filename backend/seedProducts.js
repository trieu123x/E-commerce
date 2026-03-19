import db from "./models/index.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const { sequelize, Product, ProductImage } = db;

async function seedProducts() {
  const t = await sequelize.transaction();

  try {
    const categories = [2,3,4,5,6,7,8,9,10,11];

    const productsData = [];

    for (let i = 1; i <= 100; i++) {
      productsData.push({
        name: `Product ${i}`,
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 100000, max: 5000000 }),
        stock: faker.number.int({ min: 10, max: 200 }),
        category_id: categories[Math.floor(Math.random() * categories.length)],
        status: "ACTIVE"
      });
    }

    const createdProducts = await Product.bulkCreate(productsData, {
      returning: true,
      transaction: t
    });

    const imagesData = [];

    createdProducts.forEach((product) => {
      for (let i = 1; i <= 3; i++) {
        imagesData.push({
          product_id: product.id,
          image_url: `example${i}.jpg`,
          is_main: i === 1
        });
      }
    });

    await ProductImage.bulkCreate(imagesData, { transaction: t });

    await t.commit();

    console.log("✅ Seed thành công!");
    process.exit();

  } catch (error) {
    await t.rollback();
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
}

seedProducts();