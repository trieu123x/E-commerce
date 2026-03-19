import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ProductImage = sequelize.define('ProductImage', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
            field:'image_url'
        },
        is_main: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field:'is_main'
        }
    }, {
        tableName: 'product_images',
        timestamps: false
    });
    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
    return ProductImage;
}