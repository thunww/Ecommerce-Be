// models/shipment.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubOrder = require('./suborder');
const User = require('./user');

class Shipment extends Model {}

Shipment.init(
  {
    tracking_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('waiting', 'in_transit', 'delivered', 'failed'),
      defaultValue: 'waiting',
    },
    estimated_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actual_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'Shipment',
    tableName: 'Shipments',
    timestamps: true,
  }
);



module.exports = Shipment;
