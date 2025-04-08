'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Coupons', 'shop_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Shops',
                key: 'shop_id'
            },
            onDelete: 'SET NULL'
        });

        await queryInterface.addColumn('Coupons', 'status', {
            type: Sequelize.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Coupons', 'shop_id');
        await queryInterface.removeColumn('Coupons', 'status');
    }
}; 