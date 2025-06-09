// migrations/[timestamp]-create-order-items.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Order_Items', {
      order_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      // order_item_code: {
      //   type: Sequelize.STRING(50),
      //   allowNull: true, // Cho phép null ban đầu để hỗ trợ dữ liệu cũ
      //   unique: true, // Đảm bảo mã đơn hàng là duy nhất
      // },
      sub_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sub_Orders', // Tên bảng Sub_Orders
          key: 'sub_order_id',
        },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Tên bảng Products
          key: 'product_id',
        },
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
      },
      total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Order_Items');
  },
};