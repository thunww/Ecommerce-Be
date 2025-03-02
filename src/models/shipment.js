const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Shipment extends Model {}

Shipment.init(
  {
    shipment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sub_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tracking_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
  },
  {
    sequelize,
    modelName: 'Shipment',
    tableName: 'Shipments',
    timestamps: true,
  }
);

module.exports = Shipment;
