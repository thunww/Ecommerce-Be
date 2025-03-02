// models/userCoupon.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = UserCoupon;
