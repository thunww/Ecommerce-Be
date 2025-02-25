// models/userCoupon.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Coupon = require('./coupon');
const User = require('./user');

class UserCoupon extends Model {}

UserCoupon.init(
  {
    user_coupon_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserCoupon',
    tableName: 'User_Coupons',
    timestamps: true,
  }
);

// Quan hệ 1 user_coupon thuộc về 1 user và 1 coupon
UserCoupon.belongsTo(User, { foreignKey: 'user_id' });
UserCoupon.belongsTo(Coupon, { foreignKey: 'coupon_id' });

module.exports = UserCoupon;
