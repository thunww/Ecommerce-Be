const chatService = require('../services/chatService');
const { hasAccessToChat } = require('../utils/chatUtils');

class ChatController {
    async getUserChats(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Không thể xác định ID người dùng',
                });
            }

            const userId = req.user.id;
            if (req.params.userId != userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Không có quyền truy cập danh sách chat này',
                });
            }

            console.log(`Lấy danh sách chat cho userId: ${userId}`);
            const chats = await chatService.getUserChats(userId);

            return res.status(200).json({
                status: 'success',
                data: chats,
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server',
            });
        }
    }

    async getShopChats(req, res) {
        try {
            if (!req.shop || !req.shop.id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Không thể xác định ID shop',
                });
            }

            const shopId = req.shop.id;
            if (req.params.shopId != shopId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Không có quyền truy cập danh sách chat này',
                });
            }

            console.log(`Lấy danh sách chat cho shopId: ${shopId}`);
            const chats = await chatService.getShopChats(shopId);

            return res.status(200).json({
                status: 'success',
                data: chats,
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat của shop:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server',
            });
        }
    }

    async getChatMessages(req, res) {
        try {
            const { chat_id } = req.params;
            console.log('Lấy tin nhắn cho chat_id:', chat_id);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            if (!chat_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin chat_id',
                });
            }

            if (!hasAccessToChat(req, chat_id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền truy cập cuộc trò chuyện này',
                });
            }

            const messages = await chatService.getChatMessages(chat_id, page, limit);

            return res.status(200).json({
                status: 'success',
                data: messages,
            });
        } catch (error) {
            console.error('Lỗi khi lấy tin nhắn:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server',
            });
        }
    }

    async markMessagesAsRead(req, res) {
        try {
            const { chat_id } = req.params;

            if (!chat_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin chat_id',
                });
            }

            if (!hasAccessToChat(req, chat_id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền truy cập cuộc trò chuyện này',
                });
            }

            let userId, userType;
            if (req.user) {
                userId = req.user.id;
                userType = 'user';
            } else if (req.shop) {
                userId = req.shop.id;
                userType = 'shop';
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Không thể xác định người dùng hoặc shop',
                });
            }

            console.log(`Đánh dấu tin nhắn đã đọc cho chatId: ${chat_id}, ${userType}Id: ${userId}`);
            await chatService.markMessagesAsRead(chat_id, userId, userType);

            return res.status(200).json({
                status: 'success',
                message: 'Đã đánh dấu tin nhắn là đã đọc',
            });
        } catch (error) {
            console.error('Lỗi khi đánh dấu tin nhắn:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server',
            });
        }
    }

    async countUnreadMessages(req, res) {
        try {
            let userId, userType;

            if (req.user && req.user.id) {
                userId = req.user.id;
                userType = 'user';
                if (req.params.userId && req.params.userId != userId) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Không có quyền truy cập',
                    });
                }
            } else if (req.shop && req.shop.id) {
                userId = req.shop.id;
                userType = 'shop';
                if (req.params.shopId && req.params.shopId != userId) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Không có quyền truy cập',
                    });
                }
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Không thể xác định người dùng hoặc shop',
                });
            }

            console.log(`Đếm tin nhắn chưa đọc cho ${userType}Id: ${userId}`);
            const count = await chatService.countUnreadMessages(userId, userType);

            return res.status(200).json({
                status: 'success',
                data: { unread_count: count },
            });
        } catch (error) {
            console.error('Lỗi khi đếm tin nhắn chưa đọc:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Lỗi server',
            });
        }
    }
}

module.exports = new ChatController();