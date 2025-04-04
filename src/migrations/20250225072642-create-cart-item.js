'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Kiểm tra xem các bảng liên quan đã tồn tại chưa
        const tables = await queryInterface.showAllTables();
        if (!tables.includes('carts')) {
            throw new Error('Bảng carts chưa được tạo. Vui lòng chạy migration tạo bảng carts trước.');
        }
        if (!tables.includes('products')) {
            throw new Error('Bảng products chưa được tạo. Vui lòng chạy migration tạo bảng products trước.');
        }

        await queryInterface.createTable('cart_items', {
            cart_item_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'cart_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'product_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            shop_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'shops',
                    key: 'shop_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    min: 1
                }
            },
            price: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false
            },
            total_price: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Thêm các index để tối ưu truy vấn
        await queryInterface.addIndex('cart_items', ['cart_id']);
        await queryInterface.addIndex('cart_items', ['product_id']);
        await queryInterface.addIndex('cart_items', ['shop_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('cart_items');
    }
}; 