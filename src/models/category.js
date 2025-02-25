// models/category.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      // Category may have many child categories (self-referencing association)
      this.hasMany(models.Category, {
        foreignKey: 'parent_id',
        as: 'subcategories',
      });

      // Category belongs to a parent category
      this.belongsTo(models.Category, {
        foreignKey: 'parent_id',
        as: 'parentCategory',
      });

      // Category has many Products
      this.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products',
      });
    }
  }

  Category.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: false,
      underscored: true,
    }
  );

  return Category;
};