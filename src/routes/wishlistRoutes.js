const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách yêu thích
router.get('/', authMiddleware, wishlistController.getWishlist);

// Thêm sản phẩm vào danh sách yêu thích
router.post('/add', authMiddleware, wishlistController.addToWishlist);

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/remove/:product_id', authMiddleware, wishlistController.removeFromWishlist);

// Xóa toàn bộ danh sách yêu thích
router.delete('/clear', authMiddleware, wishlistController.clearWishlist);

module.exports = router;