"use strict";

const { Model, DataTypes, Sequelize } = require("sequelize"); // Thêm Sequelize vào import
const sequelize = require("../config/database");

class CartItem extends Model { }

CartItem.init(
  {
    cart_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Carts",
        key: "cart_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "product_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    product_variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Product_Variants",
        key: "variant_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Shops",
        key: "shop_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    variant_info: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON string chứa thông tin về variant (size, color, etc.)'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Sửa thành Sequelize.literal
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Sửa thành Sequelize.literal
    },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "CartItems",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CartItem;
