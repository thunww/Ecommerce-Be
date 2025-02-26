'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// 🛠 Khởi tạo Sequelize từ file config/database.js
const sequelize = require('../config/database');

const db = {};

// 🛠 Import models thủ công (models sử dụng cú pháp class nên không cần truyền tham số khi require)
const User = require('./user');
const Role = require('./role');
const Address = require('./address');
const Category = require('./category');
const Coupon = require('./coupon');
const Notification = require('./notification');
const Order = require('./order');
const SubOrder = require('./suborder');
const OrderItem = require('./orderitem');
const Payment = require('./payment');
const Product = require('./product');
const ProductImage = require('./productimage');
const ProductReview = require('./productreview');
const Shop = require('./shop');
const ShopReview = require('./shopreview');
const Shipment = require('./shipment');
const Wishlist = require('./wishlist');
const UserCoupon = require('./usercoupon');

// 🛠 Gán models vào db
Object.assign(db, {
  User,
  Role,
  Address,
  Category,
  Coupon,
  Notification,
  Order,
  SubOrder,
  OrderItem,
  Payment,
  Product,
  ProductImage,
  ProductReview,
  Shop,
  ShopReview,
  Shipment,
  Wishlist,
  UserCoupon,
});

// 🛠 Gán Sequelize và instance vào db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 🛠 Định nghĩa quan hệ giữa các models
if (require.resolve('./associations')) {
  require('./associations')(db);
}

module.exports = db;
