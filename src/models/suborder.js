// models/sub_order.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');
const Shop = require('./shop');
const Payment = require('./payment');
const Shipment = require('./shipment');
const OrderItem = require('./orderitem');

class SubOrder extends Model {}

SubOrder.init(
  {
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']],
      },
    },
  },
  {
    sequelize,
    modelName: 'SubOrder',
    tableName: 'Sub_Orders',
    timestamps: true,
  }
);

// Quan hệ SubOrder - Order: Một SubOrder thuộc về một Order
SubOrder.belongsTo(Order, { foreignKey: 'order_id' });

// Quan hệ SubOrder - Shop: Một SubOrder thuộc về một Shop
SubOrder.belongsTo(Shop, { foreignKey: 'shop_id' });

// Quan hệ SubOrder - Payment: Một SubOrder có thể có một Payment
SubOrder.hasOne(Payment, { foreignKey: 'sub_order_id' });

// Quan hệ SubOrder - Shipment: Một SubOrder có thể có một Shipment
SubOrder.hasOne(Shipment, { foreignKey: 'sub_order_id' });

// Quan hệ SubOrder - OrderItem: Một SubOrder có thể có nhiều OrderItem
SubOrder.hasMany(OrderItem, { foreignKey: 'sub_order_id' });

module.exports = SubOrder;
