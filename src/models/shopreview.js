// models/shop_review.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ShopReview extends Model {
    static associate(models) {
      this.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shop',
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  ShopReview.init(
    {
      shop_review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ShopReview',
      tableName: 'Shop_Reviews',
      timestamps: false,
    }
  );

  return ShopReview;
};
