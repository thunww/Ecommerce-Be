'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Kiểm tra xem bảng Orders đã tồn tại chưa
        const tables = await queryInterface.showAllTables();
        const ordersTable = tables.find(table => table.toLowerCase() === 'orders');
        if (!ordersTable) {
            throw new Error('Bảng Orders chưa được tạo. Vui lòng chạy migration tạo bảng Orders trước.');
        }

        // Cập nhật status từ 'cart' thành 'pending'
        await queryInterface.sequelize.query(
            `UPDATE ${ordersTable} SET status = 'pending' WHERE status = 'cart'`
        );

        // Thay đổi kiểu dữ liệu của cột status
        await queryInterface.sequelize.query(
            `ALTER TABLE ${ordersTable} MODIFY COLUMN status VARCHAR(20)`
        );

        // Thêm ràng buộc CHECK cho cột status
        await queryInterface.sequelize.query(
            `ALTER TABLE ${ordersTable} ADD CONSTRAINT chk_order_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))`
        );
    },

    down: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();
        const ordersTable = tables.find(table => table.toLowerCase() === 'orders');
        if (!ordersTable) {
            throw new Error('Bảng Orders chưa được tạo.');
        }

        // Xóa ràng buộc CHECK
        await queryInterface.sequelize.query(
            `ALTER TABLE ${ordersTable} DROP CONSTRAINT chk_order_status`
        );

        // Khôi phục lại giá trị 'cart' cho các đơn hàng có status là 'pending'
        await queryInterface.sequelize.query(
            `UPDATE ${ordersTable} SET status = 'cart' WHERE status = 'pending'`
        );

        // Thay đổi lại kiểu dữ liệu của cột status
        await queryInterface.sequelize.query(
            `ALTER TABLE ${ordersTable} MODIFY COLUMN status ENUM('cart', 'pending', 'processing', 'shipped', 'delivered', 'cancelled')`
        );
    }
}; 