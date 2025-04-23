const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Middleware xác thực cho tất cả các routes giỏ hàng
router.use(authMiddleware);

// Lấy thông tin giỏ hàng của người dùng
router.get('/', cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post('/items', cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/items/:id', cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/items/:id', cartController.removeFromCart);

// Xóa toàn bộ giỏ hàng
router.delete('/', cartController.clearCart);

// Áp dụng mã giảm giá
router.post('/coupons', cartController.applyCoupon);

// Xóa mã giảm giá
router.delete('/coupons', cartController.removeCoupon);

// Tính phí vận chuyển
router.post('/shipping', cartController.calculateShipping);

// Lấy thông tin tổng hợp giỏ hàng
router.get('/summary', cartController.getCartSummary);

module.exports = router;