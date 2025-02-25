// models/shop.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Shop extends Model {
    static associate(models) {
      // Shop belongs to User (owner)
      this.belongsTo(models.User, {
        foreignKey: 'owner_id',
        as: 'owner',
      });

      // Shop has many Products
      this.hasMany(models.Product, {
        foreignKey: 'shop_id',
        as: 'products',
      });

      // Shop has many ShopReviews
      this.hasMany(models.ShopReview, {
        foreignKey: 'shop_id',
        as: 'reviews',
      });

      // Shop has many SubOrders (vì mỗi shop có thể có nhiều đơn hàng con)
      this.hasMany(models.SubOrder, {
        foreignKey: 'shop_id',
        as: 'sub_orders',
      });
    }
  }

  Shop.init(
    {
      shop_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shop_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      logo: {
        type: DataTypes.STRING(255),
      },
      banner: {
        type: DataTypes.STRING(255),
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
      },
      followers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_products: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      address: {
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'closed'),
        defaultValue: 'active',
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
      modelName: 'Shop',
      tableName: 'Shops',
      timestamps: false,
    }
  );

  return Shop;
};