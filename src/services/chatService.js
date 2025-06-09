const { ChatMessage, User, Shop } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ChatService {
    async getUserChats(userId) {
        try {
            console.log(`Lấy danh sách chat cho userId: ${userId}`);
            const chats = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: userId, sender_type: 'user' },
                        { receiver_id: userId, receiver_type: 'user' },
                    ],
                },
                attributes: ['chat_id', [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_time']],
                group: ['chat_id'],
            });
            console.log(`Tìm thấy ${chats.length} chat`);

            const chatIds = chats.map((c) => c.chat_id);
            const lastTimes = chats.map((c) => c.get('last_time'));

            const lastMessages = await ChatMessage.findAll({
                where: { chat_id: chatIds, created_at: lastTimes },
                order: [['created_at', 'DESC']],
            });

            const results = [];
            for (const msg of lastMessages) {
                if (!msg.chat_id.startsWith(`${userId}-`)) continue;

                const [, shopId] = msg.chat_id.split('-').map(Number);
                const shop = await Shop.findByPk(shopId, {
                    attributes: ['shop_id', 'shop_name', 'logo'],
                });

                if (!shop) {
                    console.error(`Shop không tồn tại cho shopId: ${shopId}`);
                    continue;
                }

                results.push({
                    chat_id: msg.chat_id,
                    shop,
                    last_message: msg.message,
                    last_message_time: msg.created_at,
                    unread_count: 0,
                });
            }

            console.log(`Trả về ${results.length} chat`);
            return results;
        } catch (error) {
            console.error('Lỗi trong getUserChats:', error);
            throw new Error(`Lỗi truy vấn danh sách chat: ${error.message}`);
        }
    }

    async getShopChats(shopId) {
        try {
            console.log(`Lấy danh sách chat cho shopId: ${shopId}`);
            const chats = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: shopId, sender_type: 'shop' },
                        { receiver_id: shopId, receiver_type: 'shop' },
                    ],
                },
                attributes: ['chat_id', [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_time']],
                group: ['chat_id'],
            });
            console.log(`Tìm thấy ${chats.length} chat`);

            const chatIds = chats.map((c) => c.chat_id);
            const lastTimes = chats.map((c) => c.get('last_time'));

            const lastMessages = await ChatMessage.findAll({
                where: { chat_id: chatIds, created_at: lastTimes },
                order: [['created_at', 'DESC']],
            });

            const results = [];
            for (const msg of lastMessages) {
                if (!msg.chat_id.endsWith(`-${shopId}`)) continue;

                const [userId] = msg.chat_id.split('-').map(Number);
                const user = await User.findByPk(userId, {
                    attributes: ['id', 'username', 'avatar'],
                });

                if (!user) {
                    console.error(`User không tồn tại cho userId: ${userId}`);
                    continue;
                }

                results.push({
                    chat_id: msg.chat_id,
                    user,
                    last_message: msg.message,
                    last_message_time: msg.created_at,
                    unread_count: 0,
                });
            }

            console.log(`Trả về ${results.length} chat`);
            return results;
        } catch (error) {
            console.error('Lỗi trong getShopChats:', error);
            throw new Error(`Lỗi truy vấn danh sách chat: ${error.message}`);
        }
    }

    async getChatMessages(chatId, page = 1, limit = 20) {
        try {
            console.log(`Lấy tin nhắn cho chatId: ${chatId}, page: ${page}, limit: ${limit}`);
            const offset = (page - 1) * limit;
            const messages = await ChatMessage.findAll({
                where: { chat_id: chatId },
                order: [['created_at', 'DESC']],
                limit,
                offset,
            });
            console.log(`Trả về ${messages.length} tin nhắn`);
            return messages;
        } catch (error) {
            console.error('Lỗi trong getChatMessages:', error);
            throw new Error(`Lỗi truy vấn tin nhắn: ${error.message}`);
        }
    }

    async markMessagesAsRead(chatId, userId, userType) {
        try {
            console.log(`Đánh dấu tin nhắn đã đọc cho chatId: ${chatId}, ${userType}Id: ${userId}`);
            await ChatMessage.update(
                { is_read: true },
                {
                    where: {
                        chat_id: chatId,
                        receiver_id: userId,
                        receiver_type: userType,
                        is_read: false,
                    },
                }
            );
            console.log('Đã đánh dấu tin nhắn');
        } catch (error) {
            console.error('Lỗi trong markMessagesAsRead:', error);
            throw new Error(`Lỗi đánh dấu tin nhắn: ${error.message}`);
        }
    }

    async countUnreadMessages(userId, userType) {
        try {
            console.log(`Đếm tin nhắn chưa đọc cho ${userType}Id: ${userId}`);
            const count = await ChatMessage.count({
                where: {
                    receiver_id: userId,
                    receiver_type: userType,
                    is_read: false,
                },
            });
            console.log(`Số tin nhắn chưa đọc: ${count}`);
            return count;
        } catch (error) {
            console.error('Lỗi trong countUnreadMessages:', error);
            throw new Error(`Lỗi đếm tin nhắn chưa đọc: ${error.message}`);
        }
    }
}

module.exports = new ChatService();