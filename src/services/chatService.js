const { ChatMessage, User, Shop, sequelize } = require('../models');
const { Op } = require('sequelize');

class ChatService {
    // Lấy danh sách chat của một người dùng
    async getUserChats(userId) {
        try {
            console.log('Getting chats for user ID:', userId);

            // Sử dụng subquery để lấy các chat_id duy nhất
            const chatIds = await ChatMessage.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('chat_id')), 'chat_id']
                ],
                where: {
                    [Op.or]: [
                        { sender_id: userId, sender_type: 'user' },
                        { receiver_id: userId, receiver_type: 'user' }
                    ]
                },
                raw: true
            });

            console.log('Found chat IDs:', chatIds);

            // Nếu không có chat nào, trả về mảng rỗng
            if (!chatIds.length) {
                return [];
            }

            // Lấy thông tin chi tiết của mỗi chat
            const chatDetails = [];
            for (const chatIdObj of chatIds) {
                const chatId = chatIdObj.chat_id;

                // Lấy tin nhắn gần nhất cho mỗi chat
                const latestMessage = await ChatMessage.findOne({
                    where: { chat_id: chatId },
                    order: [['created_at', 'DESC']],
                    raw: true
                });

                if (latestMessage) {
                    // Xác định ID của shop (người còn lại trong cuộc trò chuyện)
                    let shopId;
                    if (latestMessage.sender_type === 'shop') {
                        shopId = latestMessage.sender_id;
                    } else if (latestMessage.receiver_type === 'shop') {
                        shopId = latestMessage.receiver_id;
                    } else {
                        console.log('Không thể xác định shop ID cho chat:', chatId);
                        continue;
                    }

                    // Lấy thông tin shop
                    const shop = await Shop.findByPk(shopId, {
                        attributes: ['shop_id', 'shop_name', 'avatar_url'],
                        raw: true
                    });

                    chatDetails.push({
                        chat_id: chatId,
                        shop_id: shopId,
                        shop_name: shop ? shop.shop_name : 'Shop không tồn tại',
                        avatar_url: shop ? shop.avatar_url : null,
                        last_message: latestMessage.message,
                        last_message_time: latestMessage.created_at,
                        unread: latestMessage.is_read ? 0 : (latestMessage.receiver_id === userId ? 1 : 0)
                    });
                }
            }

            // Sắp xếp theo thời gian tin nhắn mới nhất
            return chatDetails.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
        } catch (error) {
            console.error('Lỗi trong getUserChats:', error);
            throw error;
        }
    }

    // Lấy danh sách chat của một shop
    async getShopChats(shopId) {
        try {
            console.log('Getting chats for shop ID:', shopId);

            // Sử dụng subquery để lấy các chat_id duy nhất
            const chatIds = await ChatMessage.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('chat_id')), 'chat_id']
                ],
                where: {
                    [Op.or]: [
                        { sender_id: shopId, sender_type: 'shop' },
                        { receiver_id: shopId, receiver_type: 'shop' }
                    ]
                },
                raw: true
            });

            console.log('Found chat IDs:', chatIds);

            // Nếu không có chat nào, trả về mảng rỗng
            if (!chatIds.length) {
                return [];
            }

            // Lấy thông tin chi tiết của mỗi chat
            const chatDetails = [];
            for (const chatIdObj of chatIds) {
                const chatId = chatIdObj.chat_id;

                // Lấy tin nhắn gần nhất cho mỗi chat
                const latestMessage = await ChatMessage.findOne({
                    where: { chat_id: chatId },
                    order: [['created_at', 'DESC']],
                    raw: true
                });

                if (latestMessage) {
                    // Xác định ID của user (người còn lại trong cuộc trò chuyện)
                    let userId;
                    if (latestMessage.sender_type === 'user') {
                        userId = latestMessage.sender_id;
                    } else if (latestMessage.receiver_type === 'user') {
                        userId = latestMessage.receiver_id;
                    } else {
                        console.log('Không thể xác định user ID cho chat:', chatId);
                        continue;
                    }

                    // Lấy thông tin user
                    const user = await User.findByPk(userId, {
                        attributes: ['user_id', 'name', 'avatar'],
                        raw: true
                    });

                    chatDetails.push({
                        chat_id: chatId,
                        user_id: userId,
                        user_name: user ? user.name : 'Người dùng không tồn tại',
                        avatar_url: user ? user.avatar : null,
                        last_message: latestMessage.message,
                        last_message_time: latestMessage.created_at,
                        unread: latestMessage.is_read ? 0 : (latestMessage.receiver_id === shopId ? 1 : 0)
                    });
                }
            }

            // Sắp xếp theo thời gian tin nhắn mới nhất
            return chatDetails.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
        } catch (error) {
            console.error('Lỗi trong getShopChats:', error);
            throw error;
        }
    }

    // Lấy tin nhắn trong một cuộc hội thoại
    async getChatMessages(chatId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const { count, rows } = await ChatMessage.findAndCountAll({
            where: { chat_id: chatId },
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        return {
            messages: rows,
            pagination: {
                total: count,
                current_page: page,
                per_page: limit,
                last_page: Math.ceil(count / limit)
            }
        };
    }

    // Đánh dấu tin nhắn là đã đọc
    async markMessagesAsRead(chatId, userId, userType) {
        await ChatMessage.update(
            { is_read: true },
            {
                where: {
                    chat_id: chatId,
                    receiver_id: userId,
                    receiver_type: userType,
                    is_read: false
                }
            }
        );

        return true;
    }

    // Tạo tin nhắn mới
    async createMessage(senderId, senderType, receiverId, receiverType, message) {
        // Tạo chat_id từ user_id và shop_id
        let chatId;
        if (senderType === 'user') {
            chatId = `${senderId}-${receiverId}`;
        } else {
            chatId = `${receiverId}-${senderId}`;
        }

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
    }

    // Đếm số tin nhắn chưa đọc
    async countUnreadMessages(userId, userType) {
        const count = await ChatMessage.count({
            where: {
                receiver_id: userId,
                receiver_type: userType,
                is_read: false
            }
        });

        return count;
    }
}

module.exports = new ChatService(); 