const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SubOrder extends Model {}

SubOrder.init(
  {
    sub_order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
