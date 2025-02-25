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
      sub_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sub_Orders', // Tên bảng Sub_Orders
          key: 'sub_order_id',
        },
        onDelete: 'CASCADE',
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['cod', 'credit_card', 'momo', 'bank_transfer']],
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
        type: Sequelize.DECIMAL(10, 2),
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
