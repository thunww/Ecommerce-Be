const { ChatMessage, User, Shop } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ChatService {
    async getUserChats(userId) {
        try {
            const chats = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: userId, sender_type: 'user' },
                        { receiver_id: userId, receiver_type: 'user' }
                    ]
                },
                attributes: [
                    'chat_id',
                    [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_time']
                ],
                group: ['chat_id'],
            });

            const chatIds = chats.map(c => c.chat_id);
            const lastTimes = chats.map(c => c.get('last_time'));

            const lastMessages = await ChatMessage.findAll({
                where: {
                    chat_id: chatIds,
                    created_at: lastTimes,
                },
                order: [['created_at', 'DESC']],
            });

            const results = [];

            for (const msg of lastMessages) {
                if (!msg.chat_id.startsWith(`${userId}-`)) continue; // 💡 userId phải đứng đầu

                const [, shopId] = msg.chat_id.split('-').map(Number);

                const shop = await Shop.findByPk(shopId, {
                    attributes: ['shop_id', 'shop_name', 'logo'],
                });

                results.push({
                    chat_id: msg.chat_id,
                    shop,
                    last_message: msg.message,
                    last_message_time: msg.created_at,
                    unread_count: 0, // có thể tính thêm
                });
            }

            return results;
        } catch (error) {
            console.error('Error in getUserChats:', error);
            throw error;
        }
    }



    // Lấy danh sách chat của shop (shopId)
    async getShopChats(shopId) {
        try {
            // Lấy chat_id và thời gian tin nhắn cuối cùng shop tham gia
            const chats = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: shopId, sender_type: 'shop' },
                        { receiver_id: shopId, receiver_type: 'shop' }
                    ]
                },
                attributes: [
                    'chat_id',
                    [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_time']
                ],
                group: ['chat_id'],
            });

            const chatIds = chats.map(c => c.chat_id);
            const lastTimes = chats.map(c => c.get('last_time'));

            // Lấy tin nhắn cuối cùng của mỗi chat_id
            const lastMessages = await ChatMessage.findAll({
                where: {
                    chat_id: chatIds,
                    created_at: lastTimes,
                },
                order: [['created_at', 'DESC']],
            });

            const results = [];

            for (const msg of lastMessages) {
                // chat_id định dạng userId-shopId
                const [userId, shopIdFromChat] = msg.chat_id.split('-').map(Number);

                // Lấy thông tin user đối tác
                const user = await User.findByPk(userId, {
                    attributes: ['user_id', 'username', 'profile_picture'],
                });

                results.push({
                    chat_id: msg.chat_id,
                    user,
                    last_message: msg.message,
                    last_message_time: msg.created_at,
                    unread_count: 0, // Cập nhật nếu cần
                });
            }

            return results;
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