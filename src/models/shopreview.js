// models/shopReview.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./shop'); // Import Shop model
const User = require('./user'); // Import User model

class ShopReview extends Model {}

ShopReview.init(
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
    },
  },
  {
    sequelize,
    modelName: 'ShopReview',
    tableName: 'Shop_Reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

ShopReview.belongsTo(Shop, {
  foreignKey: 'shop_id',
  onDelete: 'CASCADE',
});

ShopReview.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

module.exports = ShopReview;
