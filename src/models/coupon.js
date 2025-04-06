const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Coupon extends Model { }

Coupon.init(
  {
    coupon_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    discount_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    max_discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    min_order_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Coupon',
    tableName: 'Coupons',
    timestamps: true,
  }
);

module.exports = Coupon;
