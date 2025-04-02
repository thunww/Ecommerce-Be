const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class OrderItem extends Model { }

OrderItem.init(
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sub_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

  },



  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'Order_Items',
    timestamps: true,
    underscored: true
  }
);

module.exports = OrderItem;
