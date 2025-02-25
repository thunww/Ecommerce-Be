const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

class Role extends Model {}

Role.init({
  role_name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
}, {
  sequelize,
  modelName: 'Role',
  timestamps: false,
  tableName: 'Roles'
});

// Quan hệ: Role -> UserRole -> User
Role.belongsToMany(User, { through: 'User_Roles', foreignKey: 'role_id' });

module.exports = Role;
