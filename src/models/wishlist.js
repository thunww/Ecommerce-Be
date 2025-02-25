// models/wishlist.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Wishlist extends Model {
    static associate(models) {
      // Wishlist belongs to User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // Wishlist belongs to Product
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  Wishlist.init(
    {
      wishlist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      timestamps: false,
      underscored: true,
    }
  );

  return Wishlist;
};