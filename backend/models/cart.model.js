import { DataTypes } from "sequelize";

const cartModel = (sequelize) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        tableName: 'carts',
        timestamps: false
    });

    Cart.associate = (models) => {
        Cart.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Cart.hasMany(models.CartItem, {
            foreignKey: 'cart_id',
            as: 'items'
        });
    }

    return Cart;
};

export default cartModel;