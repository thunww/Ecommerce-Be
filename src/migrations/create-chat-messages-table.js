const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('chat_messages', {
            message_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            chat_id: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'Định dạng: user_id-shop_id',
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'ID của người gửi (user_id hoặc shop_id)',
            },
            sender_type: {
                type: DataTypes.ENUM('user', 'shop'),
                allowNull: false,
                comment: 'Loại người gửi (người dùng hoặc shop)',
            },
            receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'ID của người nhận (user_id hoặc shop_id)',
            },
            receiver_type: {
                type: DataTypes.ENUM('user', 'shop'),
                allowNull: false,
                comment: 'Loại người nhận (người dùng hoặc shop)',
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Tạo index để tăng tốc truy vấn
        await queryInterface.addIndex('chat_messages', ['chat_id']);
        await queryInterface.addIndex('chat_messages', ['sender_id', 'sender_type']);
        await queryInterface.addIndex('chat_messages', ['receiver_id', 'receiver_type']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('chat_messages');
    }
}; 