const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Product extends Model {}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "inactive"),
      allowNull: false,
      defaultValue: "pending",
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    review_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Shops",
        key: "shop_id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "category_id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "Products",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Product;
