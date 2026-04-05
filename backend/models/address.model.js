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
        address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      ward: {
        type: DataTypes.STRING(100),
        allowNull: false,
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