// backend/models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

import orderModel from './order.model.js';
import orderItemModel from './orderItem.model.js';
import productImageModel from './productImage.model.js';
import productModel from './product.model.js';
import addressModel from './address.model.js';
import userModel from './user.model.js';
import cartModel from './cart.model.js';
import cartItemModel from './cartItem.model.js';
import categoryModel from './category.model.js';
import wishlistModel from './wishlist.model.js';
import reviewModel from './review.model.js';
import paymentModel from './payment.model.js';
import saleModel from './sale.model.js';
import productSaleModel from './productSale.model.js';

// Khởi tạo models với sequelize instance
db.Address = addressModel(sequelize, DataTypes);
db.ProductImage = productImageModel(sequelize, DataTypes);
db.Product = productModel(sequelize, DataTypes);
db.User = userModel(sequelize, DataTypes);
db.CartItem = cartItemModel(sequelize, DataTypes);
db.Cart = cartModel(sequelize, DataTypes);
db.Order = orderModel(sequelize, DataTypes);
db.OrderItem = orderItemModel(sequelize, DataTypes);
db.Category = categoryModel(sequelize, DataTypes);
db.Wishlist = wishlistModel(sequelize, DataTypes);
db.Review = reviewModel(sequelize, DataTypes);
db.Payment = paymentModel(sequelize, DataTypes);
db.Sale = saleModel(sequelize, DataTypes);
db.ProductSale = productSaleModel(sequelize, DataTypes);


// Kiểm tra xem models đã được khởi tạo chưa
console.log('Models initialized:');
console.log('- ProductImage:', !!db.ProductImage);
console.log('- Product:', !!db.Product);
console.log('- User:', !!db.User);
console.log('- Cart:', !!db.Cart);
console.log('- CartItem:', !!db.CartItem);
console.log('- Order:', !!db.Order);
console.log('- OrderItem:', !!db.OrderItem);
console.log('- Address:', !!db.Address);
console.log('- Category:', !!db.Category);
console.log('- Wishlist:', !!db.Wishlist);
console.log('- Review:', !!db.Review);
console.log('- Payment:', !!db.Payment);
console.log("- Sale", !!db.Sale);
console.log("- ProductSale", !!db.ProductSale)
console.log("Loaded models:", Object.keys(db));


// Gọi hàm associate để thiết lập quan hệ
Object.keys(db).forEach(modelName => {
  console.log(`Setting up associations for ${modelName}...`);
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      console.log(`✓ ${modelName} associations set successfully`);
    } catch (error) {
      console.error(`Error setting associations for ${modelName}:`, error.message);
      console.error('Available models:', Object.keys(db));
    }
  }
});



export default db;