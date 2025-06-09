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
    // order_item_code: {
    //   type: DataTypes.STRING(50),
    //   allowNull: true, // Cho phép null ban đầu để hỗ trợ dữ liệu cũ
    //   unique: true, // Đảm bảo mã đơn hàng là duy nhất
    //   comment: 'Mã đơn hàng dạng chuỗi (ví dụ: ORD-20250527-001)'
    // },
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
