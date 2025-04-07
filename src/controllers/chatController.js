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

            console.log('Getting chat messages, user:', req.user, 'shop:', req.shop);

            // Kiểm tra quyền truy cập - gọi hàm tiện ích
            const hasAccess = checkAccessToChat(req, chat_id);
            console.log('Has access to chat:', hasAccess);

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
            let userId, userType;

            // Xác định loại người dùng (shop hay user)
            if (req.user) {
                userId = req.user.id;
                userType = 'user';
            } else if (req.shop) {
                userId = req.shop.id;
                userType = 'shop';
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized'
                });
            }

            console.log('Marking messages as read, user:', req.user, 'shop:', req.shop);

            // Kiểm tra quyền truy cập - gọi hàm tiện ích
            const hasAccess = checkAccessToChat(req, chat_id);
            console.log('Has access to chat:', hasAccess);

            if (!hasAccess) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền truy cập cuộc trò chuyện này'
                });
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
            console.log('User in countUnreadMessages:', req.user);
            console.log('Shop in countUnreadMessages:', req.shop);

            let userId, userType;

            // Xác định loại người dùng (shop hay user)
            if (req.user && req.user.id) {
                userId = req.user.id;
                userType = 'user';
                console.log('Using user ID:', userId);
            } else if (req.shop && req.shop.id) {
                userId = req.shop.id;
                userType = 'shop';
                console.log('Using shop ID:', userId);
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

    // Kiểm tra quyền truy cập vào một cuộc trò chuyện
    hasAccessToChat(req, chatId) {
        console.log('Checking access to chat:', chatId);
        console.log('User:', req.user);
        console.log('Shop:', req.shop);

        if (!chatId || typeof chatId !== 'string') {
            console.log('Invalid chat ID format');
            return false;
        }

        const parts = chatId.split('-');
        if (parts.length !== 2) {
            console.log('Invalid chat ID format (not user-shop format)');
            return false;
        }

        try {
            const userId = parseInt(parts[0]);
            const shopId = parseInt(parts[1]);

            console.log('Parsed user ID:', userId, 'shop ID:', shopId);

            if (isNaN(userId) || isNaN(shopId)) {
                console.log('Invalid chat ID (not numeric)');
                return false;
            }

            if (req.user && req.user.id === userId) {
                console.log('Access granted to user');
                return true;
            }

            if (req.shop && req.shop.id === shopId) {
                console.log('Access granted to shop');
                return true;
            }

            console.log('Access denied');
            return false;
        } catch (error) {
            console.error('Error in hasAccessToChat:', error);
            return false;
        }
    }

    // Thêm phương thức gửi tin nhắn mới qua REST API
    async sendMessage(req, res) {
        try {
            const { receiver_id, message } = req.body;

            if (!receiver_id || !message) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin người nhận hoặc nội dung tin nhắn'
                });
            }

            let senderId, senderType, receiverId, receiverType;

            // Xác định người gửi là user hay shop
            if (req.user) {
                senderId = req.user.id;
                senderType = 'user';
                receiverId = receiver_id;
                receiverType = 'shop';
            } else if (req.shop) {
                senderId = req.shop.id;
                senderType = 'shop';
                receiverId = receiver_id;
                receiverType = 'user';
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized'
                });
            }

            console.log(`Gửi tin nhắn từ ${senderType} (ID: ${senderId}) đến ${receiverType} (ID: ${receiverId}): ${message}`);

            // Lưu tin nhắn vào database
            const newMessage = await chatService.createMessage(
                senderId,
                senderType,
                receiverId,
                receiverType,
                message
            );

            return res.status(201).json({
                status: 'success',
                message: 'Tin nhắn đã được gửi',
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
}

// Hàm tiện ích kiểm tra quyền truy cập (tách riêng thành function độc lập)
function checkAccessToChat(req, chatId) {
    console.log('Checking access to chat:', chatId);
    console.log('User:', req.user);
    console.log('Shop:', req.shop);

    if (!chatId || typeof chatId !== 'string') {
        console.log('Invalid chat ID format');
        return false;
    }

    const parts = chatId.split('-');
    if (parts.length !== 2) {
        console.log('Invalid chat ID format (not user-shop format)');
        return false;
    }

    try {
        const userId = parseInt(parts[0]);
        const shopId = parseInt(parts[1]);

        console.log('Parsed user ID:', userId, 'shop ID:', shopId);

        if (isNaN(userId) || isNaN(shopId)) {
            console.log('Invalid chat ID (not numeric)');
            return false;
        }

        if (req.user && req.user.id === userId) {
            console.log('Access granted to user');
            return true;
        }

        if (req.shop && req.shop.id === shopId) {
            console.log('Access granted to shop');
            return true;
        }

        console.log('Access denied');
        return false;
    } catch (error) {
        console.error('Error in checkAccessToChat:', error);
        return false;
    }
}

// Tạo instance của controller và xuất
const chatController = new ChatController();
module.exports = chatController; 