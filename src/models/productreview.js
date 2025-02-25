// models/productReview.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');
const User = require('./user');

class ProductReview extends Model {}

ProductReview.init(
  {
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ProductReview',
    tableName: 'Product_Reviews',
    timestamps: true,
  }
);

// Quan hệ với Product
ProductReview.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});

// Quan hệ với User
ProductReview.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

module.exports = ProductReview;
