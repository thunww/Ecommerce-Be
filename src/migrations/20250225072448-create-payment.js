// migrations/[timestamp]-create-payments.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      payment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'order_id',
        },
        onDelete: 'CASCADE',
      },
      sub_order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Sub_Orders',
          key: 'sub_order_id',
        },
        onDelete: 'CASCADE',
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['cod', 'momo', 'vnpay', 'bank_transfer']],
        },
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'paid', 'failed', 'refunded']],
        },
      },
      transaction_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      paid_at: {
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
    await queryInterface.dropTable('Payments');
  },
};

