import { DataTypes } from "sequelize";

// eslint-disable-next-line import/no-anonymous-default-export
export default (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: false,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    
    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "items",
    });
    Order.hasOne(models.Payment, {
      foreignKey: "order_id",
      as: "payment",
    });
  };

  return Order;
};