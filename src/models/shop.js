const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const SubOrder = require('./suborder');
const ShopReview = require('./shopreview');

class Shop extends Model {}

Shop.init({
  shop_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  logo: { type: DataTypes.STRING(255), allowNull: true },
  banner: { type: DataTypes.STRING(255), allowNull: true },
  rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0.00 },
  followers: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_products: { type: DataTypes.INTEGER, defaultValue: 0 },
  address: { type: DataTypes.STRING(255), allowNull: true },
  status: { type: DataTypes.STRING(20), defaultValue: 'active', validate: { isIn: [['active', 'suspended', 'closed']] } },
}, {
  sequelize,
  modelName: 'Shop',
  timestamps: true,
  tableName: 'Shops'
});


module.exports = Shop;
