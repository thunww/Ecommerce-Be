// models/userCoupon.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserCoupon extends Model {
    static associate(models) {
      // UserCoupon belongs to User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // UserCoupon belongs to Coupon
      this.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id',
        as: 'coupon',
      });
    }
  }

  UserCoupon.init(
    {
      user_coupon_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      },
    },
    {
      sequelize,
      modelName: 'UserCoupon',
      tableName: 'User_Coupons',
      timestamps: false,
      underscored: true,
    }
  );

  return UserCoupon;
};