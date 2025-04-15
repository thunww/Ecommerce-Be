'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Thêm cột variant_id
        await queryInterface.addColumn('Order_Items', 'variant_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Product_Variants',
                key: 'variant_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // Thêm cột variant_info để lưu thông tin biến thể
        await queryInterface.addColumn('Order_Items', 'variant_info', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'JSON string chứa thông tin về variant (size, color, etc.)'
        });

        // Thêm index để tối ưu truy vấn
        await queryInterface.addIndex('Order_Items', ['variant_id']);
    },

    down: async (queryInterface, Sequelize) => {
        // Xóa index
        await queryInterface.removeIndex('Order_Items', ['variant_id']);

        // Xóa các cột đã thêm
        await queryInterface.removeColumn('Order_Items', 'variant_info');
        await queryInterface.removeColumn('Order_Items', 'variant_id');
    }
}; 