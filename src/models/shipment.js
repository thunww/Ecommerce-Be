const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
      references: {
        model: "SubOrders",
        key: "sub_order_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Shippers",
        key: "shipper_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tracking_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("waiting", "in_transit", "delivered", "failed"),
      defaultValue: "waiting",
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
    modelName: "Shipment",
    tableName: "Shipments",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Shipment;
