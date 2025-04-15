const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Shop extends Model {
  static associate(models) {
    // Quan hệ với User
    Shop.belongsTo(models.User, {
      foreignKey: "owner_id",
      as: "owner",
    });

    // Quan hệ với Product
    Shop.hasMany(models.Product, {
      foreignKey: "shop_id",
      as: "products",
    });
  }
}

Shop.init(
  {
    shop_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Shop",
    tableName: "Shops",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Shop;
