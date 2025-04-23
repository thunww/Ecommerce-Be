// migrations/[timestamp]-create-orders.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng Users
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      shipping_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Addresses',
          key: 'address_id',
        },
        onDelete: 'CASCADE',
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('cod', 'momo', 'vnpay', 'bank_transfer'),
        allowNull: false,
        defaultValue: 'cod',
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
      },
      note: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('Orders');
  },
};