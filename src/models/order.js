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
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  shipping_address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Addresses',
      key: 'address_id'
    },
    onDelete: 'CASCADE'
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('cod', 'momo', 'vnpay', 'bank_transfer'),
    allowNull: false,
    defaultValue: 'cod'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
  },
  total_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  shipping_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'Orders',
  timestamps: true,
  underscored: true
});

module.exports = Order;
