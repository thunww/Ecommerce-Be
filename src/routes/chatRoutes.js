const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const shopAuthMiddleware = require('../middleware/shopAuthMiddleware');

// Middleware để kiểm tra xác thực người dùng hoặc shop
const checkAuth = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: 'error',
            message: 'Bạn cần đăng nhập để sử dụng tính năng này'
        });
    }

    const token = authHeader.split(" ")[1];
    const jwt = require('../config/jwt');

    // Thử xác thực như người dùng
    const userDecoded = jwt.verifyToken(token);

    if (userDecoded) {
        // Đảm bảo có ID người dùng
        if (!userDecoded.id && userDecoded.user_id) {
            userDecoded.id = userDecoded.user_id;
        }

        req.user = userDecoded;
        return next();
    }

    // Thử xác thực như shop
    const shopDecoded = jwt.verifyShopToken(token);

    if (shopDecoded) {
        // Đảm bảo có ID shop
        if (!shopDecoded.id && shopDecoded.shop_id) {
            shopDecoded.id = shopDecoded.shop_id;
        }

        req.shop = shopDecoded;
        return next();
    }

    // Nếu không xác thực được
    return res.status(403).json({
        status: 'error',
        message: 'Token không hợp lệ'
    });
};

// Routes cho người dùng
router.get('/user/chats', authMiddleware, chatController.getUserChats);
router.get('/user/chats/:chat_id', authMiddleware, chatController.getChatMessages);
router.post('/user/chats/:chat_id/read', authMiddleware, chatController.markMessagesAsRead);
router.get('/user/unread', authMiddleware, chatController.countUnreadMessages);
router.post('/user/send', authMiddleware, chatController.sendMessage);

// Routes cho shop
router.get('/shop/chats', shopAuthMiddleware, chatController.getShopChats);
router.get('/shop/chats/:chat_id', shopAuthMiddleware, chatController.getChatMessages);
router.post('/shop/chats/:chat_id/read', shopAuthMiddleware, chatController.markMessagesAsRead);
router.get('/shop/unread', shopAuthMiddleware, chatController.countUnreadMessages);
router.post('/shop/send', shopAuthMiddleware, chatController.sendMessage);

module.exports = router; 