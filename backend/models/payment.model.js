import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
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
      method: {
        type: DataTypes.ENUM("COD", "MOMO", "VNPAY"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "payments",
      timestamps: false,
    },
  );
  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
    };
    return Payment;
};
