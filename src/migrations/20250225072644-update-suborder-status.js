'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Kiểm tra xem bảng Sub_Orders đã tồn tại chưa
        const tables = await queryInterface.showAllTables();
        const subOrdersTable = tables.find(table => table.toLowerCase() === 'sub_orders');
        if (!subOrdersTable) {
            throw new Error('Bảng Sub_Orders chưa được tạo. Vui lòng chạy migration tạo bảng Sub_Orders trước.');
        }

        // Đầu tiên, cập nhật tất cả các đơn hàng con có status 'cart' thành 'pending'
        await queryInterface.sequelize.query(`
            UPDATE ${subOrdersTable}
            SET status = 'pending'
            WHERE status = 'cart'
        `);

        // Cập nhật cột status
        await queryInterface.sequelize.query(`
            ALTER TABLE ${subOrdersTable} 
            MODIFY COLUMN status VARCHAR(20) 
            NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
        `);
    },

    down: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();
        const subOrdersTable = tables.find(table => table.toLowerCase() === 'sub_orders');

        // Khôi phục lại cột status
        await queryInterface.sequelize.query(`
            ALTER TABLE ${subOrdersTable} 
            MODIFY COLUMN status VARCHAR(20) 
            NOT NULL DEFAULT 'cart'
            CHECK (status IN ('cart', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'))
        `);
    }
}; 