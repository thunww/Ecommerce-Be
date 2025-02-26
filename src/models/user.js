const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');
const Shop = require('./shop');
const Order = require('./order');
const ProductReview = require('./productreview');
const ShopReview = require('./shopreview');
const Wishlist = require('./wishlist');
const UserCoupon = require('./usercoupon');
const Notification = require('./notification');

class User extends Model {}

User.init({
  first_name: { type: DataTypes.STRING(50), allowNull: false },
  last_name: { type: DataTypes.STRING(50), allowNull: false },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(15), allowNull: false, unique: true },
  gender: { type: DataTypes.STRING(10), allowNull: true, validate: { isIn: [['male', 'female', 'other']] } },
  date_of_birth: { type: DataTypes.DATE, allowNull: true },
  profile_picture: { type: DataTypes.STRING(255), allowNull: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  tableName: 'Users'
});



module.exports = User;
