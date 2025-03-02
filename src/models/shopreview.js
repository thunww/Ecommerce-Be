const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ShopReview extends Model {}

ShopReview.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ShopReview',
    tableName: 'Shop_Reviews',
    timestamps: true,
  }
);

module.exports = ShopReview;
