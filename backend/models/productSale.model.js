export default (sequelize, DataTypes) => {
  const ProductSale = sequelize.define(
    "ProductSale",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sale_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "product_sales",
      timestamps: false,
    }
  );

  ProductSale.associate = (models) => {
    ProductSale.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });

    ProductSale.belongsTo(models.Sale, {
      foreignKey: "sale_id",
      as: "sale",
    });
  };

  return ProductSale;
};