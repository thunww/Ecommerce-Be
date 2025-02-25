// migrations/xxxx-create-shops.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shops', {
      shop_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shop_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      logo: {
        type: Sequelize.STRING(255),
      },
      banner: {
        type: Sequelize.STRING(255),
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.0,
      },
      followers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_products: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      address: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.ENUM('active', 'suspended', 'closed'),
        defaultValue: 'active',
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shops');
  },
};