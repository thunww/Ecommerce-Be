// models/userRole.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserRole extends Model {
    static associate(models) {
      // UserRole belongs to User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // UserRole belongs to Role
      this.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
    }
  }

  UserRole.init(
    {
      user_role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'UserRole',
      tableName: 'User_Roles',
      timestamps: false,
      underscored: true,
    }
  );

  return UserRole;
};
