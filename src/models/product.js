// models/product.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductImage = require('./productimage');
const Category = require('./category');
const Shop = require('./shop');

class Product extends Model {}

Product.init(
  {
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
      defaultValue: 0.00,
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true,
  }
);

// Quan hệ Product với ProductImage (một sản phẩm có thể có nhiều hình ảnh)
Product.hasMany(ProductImage, { foreignKey: 'product_id' });

// Quan hệ Product với Category (một sản phẩm thuộc về một danh mục)
Product.belongsTo(Category, { foreignKey: 'category_id', allowNull: true });

// Quan hệ Product với Shop (một sản phẩm thuộc về một cửa hàng)
Product.belongsTo(Shop, { foreignKey: 'shop_id' });

module.exports = Product;
