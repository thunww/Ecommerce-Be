const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const jwt = require('jsonwebtoken');

// Middleware xác thực cho cả user và shop
const checkAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Bạn cần đăng nhập để sử dụng tính năng này',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Thử xác thực như người dùng
        const userDecoded = jwt.verify(token, process.env.JWT_SECRET); // Thay bằng secret key của bạn
        if (userDecoded) {
            if (!userDecoded.id && userDecoded.user_id) {
                userDecoded.id = userDecoded.user_id;
            }
            req.user = userDecoded;
            return next();
        }

        // Thử xác thực như shop (nếu có)
        const shopDecoded = jwt.verify(token, process.env.JWT_SHOP_SECRET || process.env.JWT_SECRET);
        if (shopDecoded) {
            if (!shopDecoded.id && shopDecoded.shop_id) {
                shopDecoded.id = shopDecoded.shop_id;
            }
            req.shop = shopDecoded;
            return next();
        }

        return res.status(403).json({
            status: 'error',
            message: 'Token không hợp lệ',
        });
    } catch (error) {
        console.error('Lỗi xác thực token:', error);
        return res.status(403).json({
            status: 'error',
            message: 'Token không hợp lệ hoặc hết hạn',
        });
    }
};

// Áp dụng middleware xác thực cho tất cả các route
router.use(checkAuth);

// Lấy danh sách chat của người dùng
router.get('/user/:userId', chatController.getUserChats);

// Lấy danh sách chat của shop
router.get('/shop/:shopId', chatController.getShopChats);

// Lấy tin nhắn của một cuộc trò chuyện
router.get('/:chat_id', chatController.getChatMessages);

// Đánh dấu tin nhắn là đã đọc
router.post('/:chat_id/read', chatController.markMessagesAsRead);

// Đếm số tin nhắn chưa đọc của người dùng
router.get('/user/:userId/unread', chatController.countUnreadMessages);

// Đếm số tin nhắn chưa đọc của shop
router.get('/shop/:shopId/unread', chatController.countUnreadMessages);

module.exports = router;