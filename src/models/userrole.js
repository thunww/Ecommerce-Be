// models/userRole.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ✅ Import đúng instance
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
    sequelize, // ✅ Đảm bảo không bị undefined
    modelName: 'UserRole',
    tableName: 'User_Roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Quan hệ
UserRole.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserRole.belongsTo(Role, { foreignKey: 'role_id', onDelete: 'CASCADE' });

module.exports = UserRole;
