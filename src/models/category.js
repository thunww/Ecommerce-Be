const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product'); 

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


module.exports = Category;
