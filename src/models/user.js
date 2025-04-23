const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class User extends Model {}

User.init(
  {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING(50), allowNull: true },
    last_name: { type: DataTypes.STRING(50), allowNull: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(15), allowNull: true, unique: true },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: { isIn: [["male", "female", "other"]] },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "banned"),
      allowNull: false,
      defaultValue: "active",
    },
    date_of_birth: { type: DataTypes.DATE, allowNull: true },
    profile_picture: { type: DataTypes.STRING(255), allowNull: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    tableName: "Users",
    underscored: true,
  }
);

module.exports = User;
