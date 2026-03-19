import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middlewares.js";
import db from "../../../models/index.js";
import { Op } from 'sequelize';

const { Product, ProductImage } = db;
const router = express.Router();


// 1. Lấy danh sách sản phẩm (kèm ảnh chính)
import {  fn, col, literal } from "sequelize";

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category_id,
      min_price,
      max_price,
      status = "ACTIVE",
      sort_by = "created_at",
      sort_order = "DESC"
    } = req.query;

    const { Product, ProductImage, OrderItem, Order } = db;

    const where = {};

    // search
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    // category
    if (category_id) {
      where.category_id = category_id;
    }

    // price range
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    // status
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    // sort logic
    let order = [];

    if (sort_by === "sold") {
      order = [[literal("sold_quantity"), sort_order]];
    } else {
      order = [[sort_by, sort_order]];
    }

    const products = await Product.findAll({
      where,

      attributes: {
        include: [
          [
            fn(
              "COALESCE",
              fn("SUM", col("orderItems.quantity")),
              0
            ),
            "sold_quantity"
          ]
        ]
      },

      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
          where: { is_main: true },
          required: false
        },
        {
          model: OrderItem,
          as: "orderItems",
          attributes: [],
          required: false,
          include: [
            {
              model: Order,
              as: "order",
              attributes: [],
              where: { status: "COMPLETED" },
              required: false
            }
          ]
        }
      ],

      group: ["Product.id", "images.id"],

      limit: parseInt(limit),
      offset: parseInt(offset),

      order,
      subQuery: false
    });

    const total = await Product.count({ where });

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      stock: p.stock,
      category_id: p.category_id,
      status: p.status,
      main_image: p.images?.[0]?.image_url || null,
      sold_quantity: parseInt(p.get("sold_quantity") || 0),
      created_at: p.created_at
    }));

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
});

router.get("/top-products", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await db.sequelize.query(
      `
      SELECT 
        p.id,
        p.name,
        p.price,
        COALESCE(SUM(oi.quantity),0) AS sold_quantity,
        COALESCE(SUM(oi.quantity * oi.price),0) AS revenue
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE p.status = 'ACTIVE'
      GROUP BY p.id
      ORDER BY sold_quantity DESC
      LIMIT :limit
      `,
      {
        replacements: { limit: parseInt(limit) },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Get top products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const { year } = req.query;
    
    let query = `
      SELECT 
        EXTRACT(YEAR FROM created_at) AS year,
        EXTRACT(MONTH FROM created_at) AS month,
        SUM(total_amount) AS revenue
      FROM orders
      WHERE status = 'COMPLETED'
    `;
    const replacements = {};

    if (year) {
      query += ` AND EXTRACT(YEAR FROM created_at) = :year`;
      replacements.year = parseInt(year);
    }

    query += `
      GROUP BY year, month
      ORDER BY year, month
    `;

    const result = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: result.map(item => ({
        year: Number(item.year),
        month: Number(item.month),
        revenue: Number(item.revenue)
      }))
    });

  } catch (error) {
    console.error("Revenue stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.get("/dashboard",async (req, res) => {
  try {
    const { Product, User, Category, Order } = db;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [products, users, categories, ordersThisMonth] = await Promise.all([
      Product.count(),
      User.count(),
      Category.count(),
      Order.count({
        where: {
          created_at: {
            [db.Sequelize.Op.gte]: startOfMonth
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        products,
        users,
        categories,
        orders: ordersThisMonth
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
})

// 2. Lấy chi tiết sản phẩm (với tất cả ảnh)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'image_url', 'is_main']
      }]
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    // Format response
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: product.stock,
      category_id: product.category_id,
      status: product.status,
      images: product.images || [],
      main_image: product.images?.find(img => img.is_main)?.image_url || null,
      created_at: product.created_at,
      updated_at: product.updated_at
    };
    
    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error("Get product detail error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 3. Tạo sản phẩm mới với nhiều ảnh
router.post("/", async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock = 0,
      category_id,
      images = []
    } = req.body;
    
    console.log("📝 Create product request received");
    
    // 1. Validate
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Tên sản phẩm và giá là bắt buộc"
      });
    }
    
    // 2. Xác định field name cho images
    let imageFieldName = 'url';
    if (ProductImage && ProductImage.rawAttributes && ProductImage.rawAttributes.image_url) {
      imageFieldName = 'image_url';
    }
    console.log(`📌 Will use field name: ${imageFieldName}`);
    
    // 3. Tạo sản phẩm
    console.log(" Creating product...");
    const product = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      category_id: category_id || null,
      status: 'ACTIVE'
    });
    
    console.log(`Product created: ${product.id}`);
    
    // 4. Tạo images (nếu có)
    if (images.length > 0) {
      console.log(` Creating ${images.length} images...`);
      
      const productImagesData = images
        .filter(img => img && img.trim()) // Lọc URL rỗng
        .map((imgUrl, index) => {
          const data = {
            product_id: product.id,
            is_main: index === 0
          };
          data[imageFieldName] = imgUrl.trim();
          return data;
        });
      
      if (productImagesData.length > 0) {
        await ProductImage.bulkCreate(productImagesData);
        console.log(`${productImagesData.length} images created`);
      }
    }
    
    // 5. Lấy lại product với images (đồng bộ)
    console.log(" Fetching created product with images...");
    const createdProduct = await Product.findByPk(product.id, {
      include: [{
        model: ProductImage,
        as: 'images',
        attributes: ['id', imageFieldName, 'is_main']
      }]
    });
    
    // 6. Format response
    const responseData = {
      id: createdProduct.id,
      name: createdProduct.name,
      description: createdProduct.description,
      price: parseFloat(createdProduct.price),
      stock: createdProduct.stock,
      category_id: createdProduct.category_id,
      status: createdProduct.status,
      images: (createdProduct.images || []).map(img => ({
        id: img.id,
        url: img[imageFieldName], // Dynamic field access
        is_main: img.is_main
      })),
      created_at: createdProduct.created_at,
      updated_at: createdProduct.updated_at
    };
    
    console.log("✅ Product creation completed successfully");
    
    // 7. Gửi response - Đây là dòng cuối cùng trong try block
    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: responseData
    });
    
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Xử lý lỗi cụ thể
    let statusCode = 500;
    let errorMessage = "Lỗi server khi tạo sản phẩm";
    
    if (error.name === 'SequelizeValidationError') {
      statusCode = 400;
      errorMessage = "Dữ liệu không hợp lệ: " + 
        error.errors.map(e => e.message).join(', ');
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 409;
      errorMessage = "Sản phẩm đã tồn tại";
    } else if (error.name === 'SequelizeDatabaseError') {
      errorMessage = `Lỗi database: ${error.message}`;
    }
    
    // Gửi response lỗi - chỉ gửi 1 lần
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        type: error.name
      } : undefined
    });
  }
});
// 4. Cập nhật sản phẩm (có thể cập nhật cả ảnh)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    const { 
      name, 
      description, 
      price, 
      stock, 
      category_id,
      status,
      images // Mảng URL ảnh mới (nếu có sẽ thay thế toàn bộ ảnh cũ)
    } = req.body;
    
    // Bắt đầu transaction
    const transaction = await db.sequelize.transaction();
    
    try {
      // 1. Cập nhật thông tin sản phẩm
      await product.update({
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? parseFloat(price) : product.price,
        stock: stock !== undefined ? parseInt(stock) : product.stock,
        category_id: category_id !== undefined ? category_id : product.category_id,
        status: status !== undefined ? status : product.status
      }, { transaction });
      
      // 2. Nếu có images mới, thay thế toàn bộ ảnh cũ
      if (images !== undefined) {
        console.log('New images received:', images); // Debug
        
        // Xóa tất cả ảnh cũ
        await ProductImage.destroy({
          where: { product_id: product.id },
          transaction
        });
        
        // Thêm ảnh mới nếu có
        if (images.length > 0) {
          // 🔴 SỬA Ở ĐÂY: thay đổi 'url' thành 'image_url'
          const productImages = images.map((imgUrl, index) => ({
            product_id: product.id,
            image_url: imgUrl, // ĐỔI 'url' THÀNH 'image_url'
            is_main: index === 0 // Ảnh đầu tiên là main
          }));
          
          console.log('Creating images with data:', productImages); // Debug
          
          await ProductImage.bulkCreate(productImages, { transaction });
        }
      }
      
      // 3. Commit transaction
      await transaction.commit();
      
      // 4. Lấy lại sản phẩm với ảnh
      const updatedProduct = await Product.findByPk(product.id, {
        include: [{
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image_url', 'is_main']
        }]
      });
      
      res.json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
        data: updatedProduct
      });
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 5. Xóa sản phẩm (soft delete - chỉ đổi status)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    // Soft delete - chỉ đổi status
    await product.update({ status: 'INACTIVE' });
    
    res.json({
      success: true,
      message: "Đã ẩn sản phẩm"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 5.5. Xóa sản phẩm vĩnh viễn (hard delete)
router.delete("/:id/permanent", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    const transaction = await db.sequelize.transaction();
    
    try {
      // 1. Xóa tất cả ảnh của sản phẩm
      await db.ProductImage.destroy({
        where: { product_id: product.id },
        transaction
      });
      
      // 2. Xóa sản phẩm
      await product.destroy({ transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: "Đã xóa sản phẩm vĩnh viễn"
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Permanent delete product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 6. Thêm ảnh vào sản phẩm
router.post("/:id/images", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    const { images } = req.body; // Mảng URL ảnh mới
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp danh sách URL ảnh"
      });
    }
    
    // Validate images
    for (const imgUrl of images) {
      if (typeof imgUrl !== 'string' || !imgUrl.trim()) {
        return res.status(400).json({
          success: false,
          message: "URL ảnh không hợp lệ"
        });
      }
    }
    
    // Tạo danh sách ảnh mới - tất cả là ảnh phụ (is_main = false)
    const productImages = images.map((imgUrl) => ({
      product_id: product.id,
      image_url: imgUrl.trim(),
      is_main: false // Luôn là ảnh phụ khi thêm mới
    }));
    
    // Nếu chưa có ảnh main nào trong sản phẩm, đặt ảnh đầu tiên làm main
    const hasMainImage = await ProductImage.findOne({
      where: { 
        product_id: product.id,
        is_main: true
      }
    });
    
    if (!hasMainImage && productImages.length > 0) {
      productImages[0].is_main = true; // Chỉ ảnh đầu tiên là main nếu chưa có main image
    }
    
    await ProductImage.bulkCreate(productImages);
    
    // Lấy lại danh sách ảnh
    const updatedImages = await ProductImage.findAll({
      where: { product_id: product.id },
      order: [['is_main', 'DESC'], ['id', 'DESC']]
    });
    
    res.status(201).json({
      success: true,
      message: "Đã thêm ảnh vào sản phẩm",
      data: updatedImages
    });
    
  } catch (error) {
    console.error("Add images error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 7. Đặt ảnh chính cho sản phẩm
router.put("/:id/images/:imageId/set-main", async (req, res) => {
  try {
    const { id: productId, imageId } = req.params;
    
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    // Kiểm tra ảnh tồn tại và thuộc về sản phẩm
    const image = await ProductImage.findOne({
      where: { 
        id: imageId,
        product_id: productId
      }
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh"
      });
    }
    
    // Transaction để đảm bảo tính nhất quán
    const transaction = await db.sequelize.transaction();
    
    try {
      // 1. Bỏ main của tất cả ảnh khác
      await ProductImage.update(
        { is_main: false },
        { 
          where: { 
            product_id: productId,
            id: { [Op.ne]: imageId }
          },
          transaction
        }
      );
      
      // 2. Đặt ảnh này làm main
      await image.update({ is_main: true }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: "Đã đặt ảnh làm ảnh chính",
        data: image
      });
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error("Set main image error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 8. Xóa ảnh sản phẩm
router.delete("/:id/images/:imageId", async (req, res) => {
  try {
    const { id: productId, imageId } = req.params;
    
    // Kiểm tra ảnh tồn tại và thuộc về sản phẩm
    const image = await ProductImage.findOne({
      where: { 
        id: imageId,
        product_id: productId
      }
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh"
      });
    }
    
    const wasMain = image.is_main;
    
    // Xóa ảnh
    await image.destroy();
    
    // Nếu xóa ảnh main, đặt ảnh khác làm main
    if (wasMain) {
      const nextImage = await ProductImage.findOne({
        where: { product_id: productId },
        order: [['id', 'ASC']]
      });
      
      if (nextImage) {
        await nextImage.update({ is_main: true });
      }
    }
    
    res.json({
      success: true,
      message: "Đã xóa ảnh"
    });
    
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 9. Cập nhật trạng thái sản phẩm
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ"
      });
    }
    
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    await product.update({ status });
    
    res.json({
      success: true,
      message: `Đã cập nhật trạng thái thành ${status}`,
      data: product
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 10. Cập nhật số lượng tồn kho
router.put("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0 || isNaN(stock)) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không hợp lệ"
      });
    }
    
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    const newStock = parseInt(stock);
    await product.update({ stock: newStock });
    
    res.json({
      success: true,
      message: `Đã cập nhật tồn kho thành ${newStock}`,
      data: product
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});

// 11. Xóa vĩnh viễn sản phẩm (hard delete)
router.delete("/:id/permanent", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    const transaction = await db.sequelize.transaction();
    
    try {
      // 1. Xóa tất cả ảnh của sản phẩm
      await ProductImage.destroy({
        where: { product_id: product.id },
        transaction
      });
      
      // 2. Xóa sản phẩm
      await product.destroy({ transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: "Đã xóa sản phẩm vĩnh viễn"
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Permanent delete error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server"
    });
  }
});



export default router;