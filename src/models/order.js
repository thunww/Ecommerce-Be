const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const SubOrder = require('./suborder');

class Order extends Model {}

Order.init({
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_status: { type: DataTypes.STRING(20), defaultValue: 'unpaid', validate: { isIn: [['unpaid', 'paid', 'refunded']] } },
  shipping_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  note: { type: DataTypes.STRING(255), allowNull: true },
  status: { type: DataTypes.STRING(20), defaultValue: 'pending', validate: { isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']] } },
}, {
  sequelize,
  modelName: 'Order',
  timestamps: true,
  tableName: 'Orders'
});



module.exports = Order;
