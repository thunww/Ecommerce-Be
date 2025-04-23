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
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID của biến thể sản phẩm nếu có'
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
    variant_info: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON string chứa thông tin về variant (size, color, etc.)'
    }
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
