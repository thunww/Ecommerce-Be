const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product'); // Import Product model để khai báo quan hệ

class Category extends Model {}

Category.init(
  {
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true,
  }
);

// Quan hệ Category với Category (Danh mục con thuộc về danh mục cha)
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parentCategory' });

// Quan hệ Category với nhiều Product
Category.hasMany(Product, { foreignKey: 'category_id' });

module.exports = Category;
