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

    console.log('Token received:', token);

    // Thử xác thực như người dùng
    const userDecoded = jwt.verifyToken(token);
    console.log('User decoded:', userDecoded);

    if (userDecoded) {
        // Đảm bảo có ID người dùng
        if (!userDecoded.id && userDecoded.user_id) {
            userDecoded.id = userDecoded.user_id;
        }

        req.user = userDecoded;
        console.log('Set user in request:', req.user);
        return next();
    }

    // Thử xác thực như shop
    const shopDecoded = jwt.verifyShopToken(token);
    console.log('Shop decoded:', shopDecoded);

    if (shopDecoded) {
        // Đảm bảo có ID shop
        if (!shopDecoded.id && shopDecoded.shop_id) {
            shopDecoded.id = shopDecoded.shop_id;
        }

        req.shop = shopDecoded;
        console.log('Set shop in request:', req.shop);
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
router.get('/user/unread', authMiddleware, chatController.countUnreadMessages);

// Routes cho shop
router.get('/shop/chats', shopAuthMiddleware, chatController.getShopChats);
router.get('/shop/unread', shopAuthMiddleware, chatController.countUnreadMessages);

// Routes chung cho cả người dùng và shop
router.get('/messages/:chat_id', checkAuth, chatController.getChatMessages);
router.put('/messages/:chat_id/read', checkAuth, chatController.markMessagesAsRead);
router.post('/messages', checkAuth, chatController.sendMessage);

module.exports = router; 