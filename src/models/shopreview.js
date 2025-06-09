const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    modelName: "ShopReview",
    tableName: "Shop_Reviews",
    timestamps: true,
    createdAt: "created_at", // Ánh xạ cột createdAt thành created_at
    updatedAt: "updated_at", // Ánh xạ cột updatedAt thành updated_at
  }
);

module.exports = ShopReview;
