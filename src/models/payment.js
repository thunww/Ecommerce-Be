// models/payment.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      // Payment belongs to SubOrder
      this.belongsTo(models.SubOrder, {
        foreignKey: 'sub_order_id',
        as: 'sub_order',
      });
    }
  }

  Payment.init(
    {
      payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sub_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM('cod', 'credit_card', 'momo', 'bank_transfer'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      transaction_id: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paid_at: {
        type: DataTypes.DATE,
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
      timestamps: false,
      underscored: true,
    }
  );

  return Payment;
};