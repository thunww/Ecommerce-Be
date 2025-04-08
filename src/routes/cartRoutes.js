const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Middleware xác thực cho tất cả các routes giỏ hàng
router.use(authMiddleware);

// Thêm sản phẩm vào giỏ hàng
router.post('/', cartController.addToCart);

// Lấy thông tin giỏ hàng của người dùng
router.get('/', cartController.getCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/items/:id', cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/items/:id', cartController.removeFromCart);

// Xóa toàn bộ giỏ hàng
router.delete('/clear', cartController.clearCart);

module.exports = router;