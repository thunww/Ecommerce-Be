// models/order.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      // Order belongs to a User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // Order has many SubOrders
      this.hasMany(models.SubOrder, {
        foreignKey: 'order_id',
        as: 'sub_orders',
      });

      // Order has many OrderItems through SubOrders
      this.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'order_items',
      });

      // Order has one Payment
      this.hasOne(models.Payment, {
        foreignKey: 'order_id',
        as: 'payment',
      });

      // Order has one Shipment
      this.hasOne(models.Shipment, {
        foreignKey: 'order_id',
        as: 'shipment',
      });

      // Order can have many UserCoupons through UserCoupon table
      this.belongsToMany(models.Coupon, {
        through: models.UserCoupon,
        foreignKey: 'order_id',
        otherKey: 'coupon_id',
        as: 'coupons',
      });

      // Order has many Notifications
      this.hasMany(models.Notification, {
        foreignKey: 'order_id',
        as: 'notifications',
      });
    }
  }

  Order.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid',
      },
      shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      note: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      timestamps: false,
      underscored: true,
    }
  );

  return Order;
};
