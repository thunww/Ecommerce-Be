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



module.exports = SubOrder;
