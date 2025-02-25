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

// Quan hệ: Shop -> User (1:N)
Shop.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(Shop, { foreignKey: 'owner_id' });

// Quan hệ: Shop -> Product (1:N)
Shop.hasMany(Product, { foreignKey: 'shop_id' });
Product.belongsTo(Shop, { foreignKey: 'shop_id' });

// Quan hệ: Shop -> ShopReview (1:N)
Shop.hasMany(ShopReview, { foreignKey: 'shop_id' });
ShopReview.belongsTo(Shop, { foreignKey: 'shop_id' });

// Quan hệ: Shop -> SubOrder (1:N)
Shop.hasMany(SubOrder, { foreignKey: 'shop_id' });
SubOrder.belongsTo(Shop, { foreignKey: 'shop_id' });

module.exports = Shop;
