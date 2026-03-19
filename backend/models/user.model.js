import { DataTypes } from 'sequelize';
import bcrypt from "bcrypt";


export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      defaultValue: 'customer'
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'LOCKED'),
      defaultValue: 'ACTIVE'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      }
      // Không cần beforeUpdate hook cho password vì không có updatedAt
    }
  });
   // Instance method để kiểm tra password
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  // Method để set password
  User.prototype.setPassword = async function(newPassword) {
    this.password_hash = await bcrypt.hash(newPassword, 10);
    return this;
  };

  // Instance method để lấy thông tin public
  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  };

  User.associate = (models) => {
    User.hasMany(models.Wishlist, { foreignKey: 'user_id', as: 'wishlists' });
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
  }

  return User;
};