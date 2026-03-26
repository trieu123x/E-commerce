export default (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    "Sale",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      discount_type: {
        type: DataTypes.STRING,
        allowNull: false, // percent hoặc fixed
      },
      discount_value: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
  {
    tableName: "sales",
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
  );

  Sale.associate = (models) => {
    Sale.belongsToMany(models.Product, {
      through: models.ProductSale,
      foreignKey: "sale_id",
      otherKey: "product_id",
      as: "products",
    });
  };

  return Sale;
};