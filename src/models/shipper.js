const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Shipper extends Model {}

Shipper.init(
  {
    shipper_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      unique: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    phone: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    delivery_address: { type: DataTypes.STRING(255), allowNull: false },
    vehicle_type: {
      type: DataTypes.ENUM("bike", "car", "truck", "van"),
      allowNull: false,
    },
    license_plate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    driver_license: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "inactive", "banned"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Shipper",
    timestamps: true,
    tableName: "Shippers",
    underscored: true,
  }
);

module.exports = Shipper;
