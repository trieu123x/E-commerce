import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        parent_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        }

    }, {
        tableName: 'categories',
        timestamps: false
    });
    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products'
        });

        Category.belongsTo(models.Category, {
            foreignKey: 'parent_id',
            as: 'parent'
        });
    }
    return Category;
}