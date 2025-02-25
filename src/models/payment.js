// models/payment.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubOrder = require('./suborder');

class Payment extends Model {}

Payment.init(
  {
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['cod', 'credit_card', 'momo', 'bank_transfer']],
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'paid', 'failed', 'refunded']],
      },
    },
    transaction_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true,
  }
);

// Quan hệ với SubOrder
Payment.belongsTo(SubOrder, {
  foreignKey: 'sub_order_id',
  onDelete: 'CASCADE',
});

module.exports = Payment;
