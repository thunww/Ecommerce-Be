const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SubOrder extends Model { }

SubOrder.init(
  {
    sub_order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']],
      },
    },
  },
  {
    sequelize,
    modelName: 'SubOrder',
    tableName: 'Sub_Orders',
    timestamps: true,
    underscored: true
  }
);

// Thêm associations
SubOrder.associate = (models) => {
  SubOrder.hasOne(models.Shipment, {
    foreignKey: 'sub_order_id',
    as: 'shipment'
  });
};

module.exports = SubOrder;
