// models/orderItem.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubOrder = require('./suborder');
const Product = require('./product');

class OrderItem extends Model {}

OrderItem.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    total: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.quantity * this.price) - this.discount;
      },
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'Order_Items',
    timestamps: true,
  }
);

// Quan hệ với SubOrder
OrderItem.belongsTo(SubOrder, {
  foreignKey: 'sub_order_id',
  onDelete: 'CASCADE',
});

// Quan hệ với Product
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});

module.exports = OrderItem;
