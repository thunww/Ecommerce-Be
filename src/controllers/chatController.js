const chatService = require('../services/chatService');

class ChatController {
    constructor() {
        // Bind các phương thức để đảm bảo this trỏ đến instance của ChatController
        this.hasAccessToChat = this.hasAccessToChat.bind(this);
    }

    // Lấy danh sách cuộc trò chuyện của người dùng
    async getUserChats(req, res) {
        try {
            console.log('User object:', req.user);
            if (!req.user || !req.user.id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Không thể xác định ID người dùng'
                });
            }

            const userId = req.user.id;
            console.log('Fetching chats for user ID:', userId);

            const chats = await chatService.getUserChats(userId);

            return res.status(200).json({
                status: 'success',
                data: chats
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server'
            });
        }
    }

    // Lấy danh sách cuộc trò chuyện của shop
    async getShopChats(req, res) {
        try {
            if (!req.shop || !req.shop.id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Không thể xác định ID shop'
                });
            }

            const shopId = req.shop.id;
            const chats = await chatService.getShopChats(shopId);

            return res.status(200).json({
                status: 'success',
                data: chats
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat của shop:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server'
            });
        }
    }

    // Lấy tin nhắn của một cuộc trò chuyện
    async getChatMessages(req, res) {
        try {
            const { chat_id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            if (!chat_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin chat_id'
                });
            }

            // Kiểm tra quyền truy cập
            const hasAccess = this.hasAccessToChat(req, chat_id);
            if (!hasAccess) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền truy cập cuộc trò chuyện này'
                });
            }

            const messages = await chatService.getChatMessages(chat_id, page, limit);

            return res.status(200).json({
                status: 'success',
                data: messages
            });
        } catch (error) {
            console.error('Lỗi khi lấy tin nhắn:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server'
            });
        }
    }

    // Đánh dấu tin nhắn là đã đọc
    async markMessagesAsRead(req, res) {
        try {
            const { chat_id } = req.params;

            if (!chat_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin chat_id'
                });
            }

            // Kiểm tra quyền truy cập
            const hasAccess = this.hasAccessToChat(req, chat_id);
            if (!hasAccess) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền truy cập cuộc trò chuyện này'
                });
            }

            let userId, userType;
            if (req.user) {
                userId = req.user.id;
                userType = 'user';
            } else if (req.shop) {
                userId = req.shop.id;
                userType = 'shop';
            }

            await chatService.markMessagesAsRead(chat_id, userId, userType);

            return res.status(200).json({
                status: 'success',
                message: 'Đã đánh dấu tin nhắn là đã đọc'
            });
        } catch (error) {
            console.error('Lỗi khi đánh dấu tin nhắn:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server'
            });
        }
    }

    // Đếm số tin nhắn chưa đọc
    async countUnreadMessages(req, res) {
        try {
            let userId, userType;

            if (req.user && req.user.id) {
                userId = req.user.id;
                userType = 'user';
            } else if (req.shop && req.shop.id) {
                userId = req.shop.id;
                userType = 'shop';
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Không thể xác định người dùng hoặc shop'
                });
            }

            const count = await chatService.countUnreadMessages(userId, userType);

            return res.status(200).json({
                status: 'success',
                data: { unread_count: count }
            });
        } catch (error) {
            console.error('Lỗi khi đếm tin nhắn chưa đọc:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server'
            });
        }
    }

    // Gửi tin nhắn mới
    async sendMessage(req, res) {
        try {
            const { receiver_id, message } = req.body;

            if (!receiver_id || !message) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin người nhận hoặc nội dung tin nhắn'
                });
            }

            let senderId, senderType, receiverType;

            if (req.user) {
                senderId = req.user.id;
                senderType = 'user';
                receiverType = 'shop';
            } else if (req.shop) {
                senderId = req.shop.id;
                senderType = 'shop';
                receiverType = 'user';
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized'
                });
            }

            const newMessage = await chatService.createMessage(
                senderId,
                senderType,
                receiver_id,
                receiverType,
                message
            );

            return res.status(201).json({
                status: 'success',
                message: 'Gửi tin nhắn thành công',
                data: newMessage
            });
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server'
            });
        }
    }

    // Kiểm tra quyền truy cập vào một cuộc trò chuyện
    hasAccessToChat(req, chatId) {
        if (!chatId || typeof chatId !== 'string') {
            return false;
        }

        const parts = chatId.split('-');
        if (parts.length !== 2) {
            return false;
        }

        try {
            const userId = parseInt(parts[0]);
            const shopId = parseInt(parts[1]);

            if (isNaN(userId) || isNaN(shopId)) {
                return false;
            }

            if (req.user && req.user.id === userId) {
                return true;
            }

            if (req.shop && req.shop.id === shopId) {
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error in hasAccessToChat:', error);
            return false;
        }
    }
}

module.exports = new ChatController(); 