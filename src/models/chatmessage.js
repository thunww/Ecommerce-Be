const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

class ChatMessage extends Model { }

ChatMessage.init({
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
}, {
    sequelize,
    modelName: 'ChatMessage',
    tableName: 'chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = ChatMessage; 