// models/coupon.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Coupon extends Model {
    static associate(models) {
      // Coupon has many UserCoupons (users who have used the coupon)
      this.hasMany(models.UserCoupon, {
        foreignKey: 'coupon_id',
        as: 'userCoupons',
      });
    }
  }

  Coupon.init(
    {
      coupon_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Coupon',
      tableName: 'Coupons',
      timestamps: false,
      underscored: true,
    }
  );

  return Coupon;
};
