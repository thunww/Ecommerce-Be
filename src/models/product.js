// models/product.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      // Product belongs to a Shop
      this.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shop',
      });

      // Product belongs to a Category
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });

      // Product has many ProductImages
      this.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images',
      });

      // Product has many OrderItems
      this.hasMany(models.OrderItem, {
        foreignKey: 'product_id',
        as: 'order_items',
      });

      // Product has many ProductReviews
      this.hasMany(models.ProductReview, {
        foreignKey: 'product_id',
        as: 'reviews',
      });

      // Product belongs to many Users through Wishlists
      this.belongsToMany(models.User, {
        through: models.Wishlist,
        foreignKey: 'product_id',
        otherKey: 'user_id',
        as: 'wishlisted_by',
      });
    }
  }

  Product.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      },
      dimensions: {
        type: DataTypes.STRING(50),
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: 'Product',
      tableName: 'Products',
      timestamps: false,
      underscored: true,
    }
  );

  return Product;
};
