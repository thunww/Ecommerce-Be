// migrations/[timestamp]-create-userCoupons.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_Coupons', {
      user_coupon_id: {
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
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Coupons', // Tên bảng Coupons
          key: 'coupon_id',
        },
        onDelete: 'CASCADE',
      },
      used_at: {
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
    await queryInterface.dropTable('User_Coupons');
  },
};
