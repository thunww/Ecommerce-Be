// models/shipment.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Shipment extends Model {
    static associate(models) {
      this.belongsTo(models.SubOrder, {
        foreignKey: 'sub_order_id',
        as: 'subOrder',
      });
      this.belongsTo(models.User, {
        foreignKey: 'shipper_id',
        as: 'shipper',
      });
    }
  }

  Shipment.init(
    {
      shipment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('waiting', 'in_transit', 'delivered', 'failed'),
        defaultValue: 'waiting',
      },
      estimated_delivery_date: {
        type: DataTypes.DATE,
      },
      actual_delivery_date: {
        type: DataTypes.DATE,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Shipment',
      tableName: 'Shipments',
      timestamps: false,
    }
  );

  return Shipment;
};
