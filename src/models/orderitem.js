// models/orderItem.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrderItem extends Model {
    static associate(models) {
      // OrderItem belongs to SubOrder
      this.belongsTo(models.SubOrder, {
        foreignKey: 'sub_order_id',
        as: 'sub_order',
      });

      // OrderItem belongs to Product
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  OrderItem.init(
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const quantity = this.getDataValue('quantity') || 0;
          const price = this.getDataValue('price') || 0;
          const discount = this.getDataValue('discount') || 0;
          return (quantity * price - discount).toFixed(2);
        },
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'Order_Items',
      timestamps: false,
      underscored: true,
    }
  );

  return OrderItem;
};
