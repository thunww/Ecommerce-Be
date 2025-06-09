// migrations/[timestamp]-create-sub-orders.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sub_Orders', {
      sub_order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders', // Liên kết với bảng Orders
          key: 'order_id',
        },
        onDelete: 'CASCADE',
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Shops', // Liên kết với bảng Shops
          key: 'shop_id',
        },
        onDelete: 'CASCADE',
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 10000.00,
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('Sub_Orders');
  },
};
