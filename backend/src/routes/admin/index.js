import express from "express"
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middlewares.js";
import db from "../../config/db.js"

import { Op } from 'sequelize';
const router = express.Router();

router.use(authMiddleware)
router.use(authorize("admin"));

// Import các admin sub-routes
import productsRoutes from "./products.routes.js";
import categoryRoutes from "./category.routes.js";
import ordersRoutes from "./orders.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import usersRoutes from "./users.routes.js";
import saleRoutes from "./sale.routes.js";

// Sử dụng các admin sub-routes
router.use("/categories", categoryRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/users", usersRoutes);
router.use("/sales", saleRoutes)



// Admin routes


router.get("/users", async (req, res) => {
    try {
        console.log("🔍 === GET /users called ===");
        
        // Thêm try-catch riêng cho query
        let result;
        try {
            result = await db.query(`
                SELECT id, email, full_name, role, created_at, status
                FROM users 
                ORDER BY created_at DESC
            `);
            console.log("✅ Query executed successfully");
        } catch (queryError) {
            console.error("❌ Database query error:", queryError);
            console.error("❌ Error code:", queryError.code);
            console.error("❌ Error message:", queryError.message);
            throw queryError; // Re-throw để catch bên ngoài bắt
        }
        
        console.log("✅ Result row count:", result.rows.length);
        
        res.json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });
        
    } catch (err) {
        console.error("❌ === CATCH BLOCK ERROR ===");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Full error object:", JSON.stringify(err, null, 2));
        
        
        res.status(500).json({ 
            success: false,
            message: "Lỗi server",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// lock user
router.put("/users/:id/toggle-lock", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Không cho khóa chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ 
        message: "Không thể khóa tài khoản của chính mình" 
      });
    }
    
    const result = await db.query(
      `UPDATE users 
       SET status = CASE WHEN status = 'LOCKED' THEN 'ACTIVE' ELSE 'LOCKED' END
       WHERE id = $1
       RETURNING id, email, status`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      success: true,
      message: `Đã ${result.rows[0].status === 'LOCKED' ? 'khóa' : 'mở khóa'} user`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Toggle lock error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});
router.get("/top-products", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await db.sequelize.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.product_id = p.id) as sold_quantity,
        (SELECT COALESCE(SUM(oi.total), 0) FROM order_items oi WHERE oi.product_id = p.id) as revenue
      FROM products p
      WHERE p.status = 'ACTIVE'
      ORDER BY sold_quantity DESC
      LIMIT $1
    `, {
      bind: [parseInt(limit)],
      type: db.sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: result.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        sold_quantity: parseInt(item.sold_quantity),
        revenue: parseFloat(item.revenue)
      }))
    });
  } catch (error) {
    console.error("Get top products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
});

export default router;