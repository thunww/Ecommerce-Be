const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Address extends Model { }

Address.init(
  {
    address_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipient_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    address_line: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "Addresses",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Address;
