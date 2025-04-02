const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Order extends Model { }

Order.init({
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  shipping_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('cart', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'cart'
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'Orders',
  timestamps: true,
  underscored: true
});

module.exports = Order;