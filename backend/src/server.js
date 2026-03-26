import "dotenv/config";
import app from "./app.js";
import db from "../models/index.js";
import { Op } from "sequelize";

const PORT = process.env.PORT || 5000;

const updateExpiredSales = async () => {
  try {
    const now = new Date();
    const result = await db.Sale.update(
      { is_active: false },
      {
        where: {
          is_active: true,
          end_date: { [Op.lt]: now },
        },
      }
    );
    if (result[0] > 0) {
      console.log(`[Auto-Cron] Updated ${result[0]} expired sale(s) to INACTIVE`);
    }
  } catch (err) {
    console.error(`[Auto-Cron] Error updating expired sales: `, err.message);
  }
};

// Chạy ngay khi server start
updateExpiredSales();

// Chạy định kỳ mỗi 60s
setInterval(updateExpiredSales, 60 * 1000);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
