import "dotenv/config";
import db from "./models/index.js";
import { Op } from "sequelize";

async function verifySaleFixes() {
  try {
    console.log("--- Checking Sale Model Timestamps ---");
    const saleInstance = db.Sale.build({ name: "Test Sale", discount_type: "percent", discount_value: 10 });
    console.log("Model attributes:", Object.keys(db.Sale.rawAttributes));
    
    if (db.Sale.rawAttributes.created_at) {
      console.log("✓ created_at exists in model");
    } else {
      console.log("✗ created_at MISSING in model");
    }

    console.log("\n--- Testing updateExpiredSales Logic ---");
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 10000); // 10 seconds ago
    
    // Create a temporary expired sale for testing
    const testSale = await db.Sale.create({
      name: "Expired Test Sale",
      discount_type: "fixed",
      discount_value: 5,
      start_date: new Date(now.getTime() - 20000),
      end_date: expiredDate,
      is_active: true
    });

    console.log(`Created test sale: ${testSale.name}, ID: ${testSale.id}, Active: ${testSale.is_active}`);

    // Simulation of server.js logic
    const updateLogic = async () => {
      const currentTime = new Date();
      const result = await db.Sale.update(
        { is_active: false },
        {
          where: {
            is_active: true,
            end_date: { [Op.lt]: currentTime },
          },
        }
      );
      return result[0];
    };

    const updatedCount = await updateLogic();
    console.log(`Updated count: ${updatedCount}`);

    const verifiedSale = await db.Sale.findByPk(testSale.id);
    console.log(`Verified sale Active status: ${verifiedSale.is_active}`);

    if (verifiedSale.is_active === false) {
      console.log("✓ Auto-disable logic works!");
    } else {
      console.log("✗ Auto-disable logic FAILED");
    }

    // Cleanup
    await testSale.destroy();
    console.log("Cleaned up test sale.");

  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    await db.sequelize.close();
  }
}

verifySaleFixes();
