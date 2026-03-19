import db from "./models/index.js";
import { faker } from "@faker-js/faker";

const { sequelize, Product, ProductImage } = db;

async function fixProducts() {
  const t = await sequelize.transaction();

  try {
    const products = await Product.findAll({ transaction: t });

    for (const product of products) {
      // update name
      await product.update(
        {
          name: faker.commerce.productName()
        },
        { transaction: t }
      );

      // lấy ảnh của product
      const images = await ProductImage.findAll({
        where: { product_id: product.id },
        transaction: t
      });

      for (let i = 0; i < images.length; i++) {
        await images[i].update(
          {
            image_url: `https://picsum.photos/seed/${product.id}-${i}/600/600`
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    console.log("✅ Fix products & images thành công!");
    process.exit();

  } catch (error) {
    await t.rollback();
    console.error("❌ Fix lỗi:", error);
    process.exit(1);
  }
}

fixProducts();