import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },  
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'reviews',
        timestamps: false,
    })
    Review.associate = (models)=>{
        Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
        Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
    return Review;
}