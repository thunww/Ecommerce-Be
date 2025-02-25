// models/user.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // User has many Shops (as owner)
      this.hasMany(models.Shop, {
        foreignKey: 'owner_id',
        as: 'owned_shops',
      });

      // User has many Orders
      this.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders',
      });

      // User has many Addresses
      this.hasMany(models.Address, {
        foreignKey: 'user_id',
        as: 'addresses',
      });

      // User has many ProductReviews
      this.hasMany(models.ProductReview, {
        foreignKey: 'user_id',
        as: 'product_reviews',
      });

      // User has many ShopReviews
      this.hasMany(models.ShopReview, {
        foreignKey: 'user_id',
        as: 'shop_reviews',
      });

      // User has many Wishlists
      this.hasMany(models.Wishlist, {
        foreignKey: 'user_id',
        as: 'wishlists',
      });

      // User has many UserRoles
      this.hasMany(models.UserRole, {
        foreignKey: 'user_id',
        as: 'roles',
      });

      // User has many Notifications
      this.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications',
      });

      // User can be a Shipper in Shipments
      this.hasMany(models.Shipment, {
        foreignKey: 'shipper_id',
        as: 'shipments',
      });

      // User has many UserCoupons
      this.hasMany(models.UserCoupon, {
        foreignKey: 'user_id',
        as: 'user_coupons',
      });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
      },
      date_of_birth: {
        type: DataTypes.DATE,
      },
      profile_picture: {
        type: DataTypes.STRING(255),
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: 'User',
      tableName: 'Users',
      timestamps: false,
      underscored: true,
    }
  );

  return User;
};