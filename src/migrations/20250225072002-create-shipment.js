// migrations/[timestamp]-create-shipments.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shipments', {
      shipment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sub_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sub_Orders', // Tên bảng Sub_Orders
          key: 'sub_order_id',
        },
        onDelete: 'CASCADE',
      },
      shipper_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng Users
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      tracking_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('waiting', 'in_transit', 'delivered', 'failed'),
        defaultValue: 'waiting',
      },
      estimated_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      actual_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('Shipments');
  },
};