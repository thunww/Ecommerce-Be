const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Wishlist extends Model {}

Wishlist.init(
  {
    wishlist_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'Wishlists',
    timestamps: true,
  }
);

module.exports = Wishlist;
