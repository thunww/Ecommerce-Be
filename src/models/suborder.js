// models/suborder.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubOrder extends Model {
    static associate(models) {
      // SubOrder belongs to Order
      this.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });

      // SubOrder belongs to Shop
      this.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shop',
      });

      // SubOrder has many OrderItems
      this.hasMany(models.OrderItem, {
        foreignKey: 'sub_order_id',
        as: 'order_items',
      });

      // SubOrder has one Payment
      this.hasOne(models.Payment, {
        foreignKey: 'sub_order_id',
        as: 'payment',
      });

      // SubOrder has one Shipment
      this.hasOne(models.Shipment, {
        foreignKey: 'sub_order_id',
        as: 'shipment',
      });
    }
  }

  SubOrder.init(
    {
      sub_order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
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
      modelName: 'SubOrder',
      tableName: 'Sub_Orders',
      timestamps: false,
    }
  );

  return SubOrder;
};