// migrations/xxxx-create-shipments.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shipments', {
      shipment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sub_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sub_Orders',
          key: 'sub_order_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shipper_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tracking_number: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('waiting', 'in_transit', 'delivered', 'failed'),
        defaultValue: 'waiting',
      },
      estimated_delivery_date: {
        type: Sequelize.DATE,
      },
      actual_delivery_date: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shipments');
  },
};
