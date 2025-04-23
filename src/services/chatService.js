const { ChatMessage, User, Shop } = require('../models');
const { Op } = require('sequelize');

class ChatService {
    // Lấy danh sách cuộc trò chuyện của người dùng
    async getUserChats(userId) {
        try {
            const messages = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: userId, sender_type: 'user' },
                        { receiver_id: userId, receiver_type: 'user' }
                    ]
                },
                include: [
                    {
                        model: Shop,
                        as: 'shop',
                        attributes: ['id', 'name', 'avatar']
                    }
                ],
                order: [['created_at', 'DESC']],
                group: ['shop_id']
            });

            return messages.map(msg => ({
                chat_id: `${userId}-${msg.shop.id}`,
                shop: msg.shop,
                last_message: msg.message,
                last_message_time: msg.created_at,
                unread_count: 0 // Sẽ được cập nhật sau
            }));
        } catch (error) {
            console.error('Error in getUserChats:', error);
            throw error;
        }
    }

    // Lấy danh sách cuộc trò chuyện của shop
    async getShopChats(shopId) {
        try {
            const messages = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: shopId, sender_type: 'shop' },
                        { receiver_id: shopId, receiver_type: 'shop' }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatar']
                    }
                ],
                order: [['created_at', 'DESC']],
                group: ['user_id']
            });

            return messages.map(msg => ({
                chat_id: `${msg.user.id}-${shopId}`,
                user: msg.user,
                last_message: msg.message,
                last_message_time: msg.created_at,
                unread_count: 0 // Sẽ được cập nhật sau
            }));
        } catch (error) {
            console.error('Error in getShopChats:', error);
            throw error;
        }
    }

    // Lấy chi tiết một cuộc trò chuyện
    async getChatDetails(chatId) {
        try {
            const [userId, shopId] = chatId.split('-').map(Number);

            if (isNaN(userId) || isNaN(shopId)) {
                throw new Error('Invalid chat ID format');
            }

            const user = await User.findByPk(userId, {
                attributes: ['id', 'username', 'avatar']
            });

            const shop = await Shop.findByPk(shopId, {
                attributes: ['id', 'name', 'avatar']
            });

            if (!user || !shop) {
                throw new Error('Chat not found');
            }

            return {
                chat_id: chatId,
                user,
                shop
            };
        } catch (error) {
            console.error('Error in getChatDetails:', error);
            throw error;
        }
    }

    // Lấy tin nhắn của một cuộc trò chuyện
    async getChatMessages(chatId, page = 1, limit = 20) {
        try {
            const [userId, shopId] = chatId.split('-').map(Number);

            if (isNaN(userId) || isNaN(shopId)) {
                throw new Error('Invalid chat ID format');
            }

            const offset = (page - 1) * limit;

            const messages = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        {
                            sender_id: userId,
                            sender_type: 'user',
                            receiver_id: shopId,
                            receiver_type: 'shop'
                        },
                        {
                            sender_id: shopId,
                            sender_type: 'shop',
                            receiver_id: userId,
                            receiver_type: 'user'
                        }
                    ]
                },
                order: [['created_at', 'DESC']],
                limit,
                offset
            });

            return messages;
        } catch (error) {
            console.error('Error in getChatMessages:', error);
            throw error;
        }
    }

    // Đánh dấu tin nhắn là đã đọc
    async markMessagesAsRead(chatId, userId, userType) {
        try {
            const [chatUserId, shopId] = chatId.split('-').map(Number);

            if (isNaN(chatUserId) || isNaN(shopId)) {
                throw new Error('Invalid chat ID format');
            }

            await ChatMessage.update(
                { is_read: true },
                {
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { sender_id: userId, sender_type: userType },
                                    { receiver_id: userId, receiver_type: userType }
                                ]
                            },
                            {
                                [Op.or]: [
                                    { sender_id: chatUserId, sender_type: 'user' },
                                    { receiver_id: chatUserId, receiver_type: 'user' }
                                ]
                            },
                            {
                                [Op.or]: [
                                    { sender_id: shopId, sender_type: 'shop' },
                                    { receiver_id: shopId, receiver_type: 'shop' }
                                ]
                            },
                            { is_read: false }
                        ]
                    }
                }
            );
        } catch (error) {
            console.error('Error in markMessagesAsRead:', error);
            throw error;
        }
    }

    // Đếm số tin nhắn chưa đọc
    async countUnreadMessages(userId, userType) {
        try {
            const count = await ChatMessage.count({
                where: {
                    [Op.and]: [
                        { receiver_id: userId },
                        { receiver_type: userType },
                        { is_read: false }
                    ]
                }
            });

            return count;
        } catch (error) {
            console.error('Error in countUnreadMessages:', error);
            throw error;
        }
    }

    // Tạo tin nhắn mới
    async createMessage(senderId, senderType, receiverId, receiverType, message) {
        try {
            if (!message || !senderId || !receiverId) {
                throw new Error('Missing required fields');
            }

            const chatId = senderType === 'user'
                ? `${senderId}-${receiverId}`
                : `${receiverId}-${senderId}`;

            const newMessage = await ChatMessage.create({
                chat_id: chatId,
                sender_id: senderId,
                sender_type: senderType,
                receiver_id: receiverId,
                receiver_type: receiverType,
                message,
                is_read: false
            });

            return newMessage;
        } catch (error) {
            console.error('Error in createMessage:', error);
            throw error;
        }
    }
}

module.exports = new ChatService(); 