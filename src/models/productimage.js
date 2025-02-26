// models/product_image.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');

class ProductImage extends Model {}

ProductImage.init(
  {
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'Product_Images',
    timestamps: false,
  }
);



module.exports = ProductImage;
