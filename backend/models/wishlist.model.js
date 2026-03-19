import { DataTypes } from "sequelize";

export default (sequelize) => { 
    const Wishlist = sequelize.define('Wishlist', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        tableName: 'wishlists',
        timestamps: false
    });

    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Wishlist.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    }
    return Wishlist;
}