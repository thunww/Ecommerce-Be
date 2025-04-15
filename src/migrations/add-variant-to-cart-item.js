'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Thêm cột product_variant_id
        await queryInterface.addColumn('CartItems', 'product_variant_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Product_Variants',
                key: 'variant_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        // Thêm cột variant_info để lưu thông tin biến thể
        await queryInterface.addColumn('CartItems', 'variant_info', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'JSON string chứa thông tin về variant (size, color, etc.)'
        });

        // Thêm index để tối ưu truy vấn
        await queryInterface.addIndex('CartItems', ['product_variant_id']);
    },

    down: async (queryInterface, Sequelize) => {
        // Xóa index
        await queryInterface.removeIndex('CartItems', ['product_variant_id']);

        // Xóa các cột đã thêm
        await queryInterface.removeColumn('CartItems', 'variant_info');
        await queryInterface.removeColumn('CartItems', 'product_variant_id');
    }
}; 