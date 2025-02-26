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


module.exports = Wishlist;
