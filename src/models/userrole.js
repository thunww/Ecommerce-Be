// models/userRole.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Role = require('./role');

class UserRole extends Model {}

UserRole.init(
  {
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserRole',
    tableName: 'User_Roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Quan hệ với User
UserRole.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// Quan hệ với Role
UserRole.belongsTo(Role, {
  foreignKey: 'role_id',
  onDelete: 'CASCADE',
});

module.exports = UserRole;
