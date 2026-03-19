import { DataTypes } from "sequelize";

export default (sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        cart_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        }
    }, {
        tableName: 'cart_items',
        timestamps: false
    });
    CartItem.associate = (models) => {
        CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
        CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
    return CartItem;
}