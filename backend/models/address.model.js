import { DataTypes } from "sequelize";

const addressModel = (sequelize) => {
  const Address = sequelize.define(
    "Address",
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
      house_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      street_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ward: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: "addresses",
      timestamps: false
    }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Address;
};

export default addressModel;