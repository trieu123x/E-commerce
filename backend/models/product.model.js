import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      reserved_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE'
    }
    },
    {
      tableName: "products",
      timestamps: false,
    },
  );

  Product.prototype.reduceStock = async function (quantity) {
    if (this.stock < quantity) {
      throw new Err("Không đủ hàng trong kho");
    }
    this.stock -= quantity;
    await this.save();
    return this;
  };
  Product.prototype.increaseStock = async function (quantity) {
    this.stock += quantity;
    await this.save();
    return this;
  };
  Product.associate = (models) => {
    Product.hasMany(models.ProductImage, { foreignKey: "product_id", as: "images" });
    Product.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
    Product.hasMany(models.Review, { foreignKey: "product_id", as: "reviews" });
    Product.hasMany(models.Wishlist, { foreignKey: "product_id", as: "wishlists" });
    Product.hasMany(models.OrderItem, {
  foreignKey: "product_id",
  as: "orderItems"
    });
    Product.belongsToMany(models.Sale, {
  through: models.ProductSale,
  foreignKey: "product_id",
  otherKey: "sale_id",
  as: "sales",
});
  }

  return Product;
};
