import { DataTypes } from "sequelize";

// eslint-disable-next-line import/no-anonymous-default-export
export default (sequelize) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      }
    },
    {
      tableName: "order_items",
      timestamps: false,
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
    
    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return OrderItem;
};