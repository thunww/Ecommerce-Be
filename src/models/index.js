"use strict";

require("dotenv").config();
const { Sequelize } = require("sequelize");


// 🛠 Khởi tạo Sequelize từ file config/database.js
const sequelize = require("../config/database");

const db = {};

// 🛠 Import models thủ công (models sử dụng cú pháp class nên không cần truyền tham số khi require)
const User = require("./user");
const Role = require("./role");
const Address = require("./address");
const Category = require("./category");
const Coupon = require("./coupon");
const Notification = require("./notification");
const Order = require("./order");
const SubOrder = require("./suborder");
const OrderItem = require("./orderitem");
const Payment = require("./payment");
const Product = require("./product");
const ProductReview = require("./productreview");
const Shop = require("./shop");
const ShopReview = require("./shopreview");
const Shipment = require("./shipment");
const Wishlist = require("./wishlist");
const UserCoupon = require("./usercoupon");
const UserRole = require("./userrole");
const Shipper = require("./shipper");
const ProductVariant = require("./productvariants");

const Cart = require("./cart");
const CartItem = require("./cartItem");
const ChatMessage = require("./chatmessage");
// 🛠 Gán models vào db
Object.assign(db, {
  User,
  Role,
  UserRole,
  Address,
  Category,
  Coupon,
  Notification,
  Order,
  SubOrder,
  OrderItem,
  Payment,
  Product,
  ProductReview,
  Shop,
  ShopReview,
  Shipment,
  Wishlist,
  UserCoupon,
  Shipper,
  ProductVariant,
  Cart,
  CartItem,
  ChatMessage,
});

// 🛠 Gán Sequelize và instance vào db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 🛠 Định nghĩa quan hệ giữa các models
if (require.resolve("./associations")) {
  require("./associations")(db);
}

module.exports = db;
