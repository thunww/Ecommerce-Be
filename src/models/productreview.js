const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ProductReview extends Model {}

ProductReview.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ProductReview',
    tableName: 'Product_Reviews',
    timestamps: true,
  }
);

module.exports = ProductReview;
