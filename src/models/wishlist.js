// models/wishlist.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');

class Wishlist extends Model {}

Wishlist.init(
  {
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'Wishlists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Quan hệ với User
Wishlist.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// Quan hệ với Product
Wishlist.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});

module.exports = Wishlist;
