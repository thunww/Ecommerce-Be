const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách mã giảm giá
router.get('/', couponController.getAllCoupons);

// Lấy thông tin mã giảm giá theo ID
router.get('/:coupon_id', couponController.getCouponById);

// Tạo mã giảm giá mới (chỉ admin)
router.post('/', authMiddleware, adminMiddleware, couponController.createCoupon);

// Cập nhật mã giảm giá (chỉ admin)
router.put('/:coupon_id', authMiddleware, adminMiddleware, couponController.updateCoupon);

// Xóa mã giảm giá (chỉ admin)
router.delete('/:coupon_id', authMiddleware, adminMiddleware, couponController.deleteCoupon);

// Kiểm tra mã giảm giá
router.post('/validate/:code', authMiddleware, couponController.validateCoupon);

module.exports = router; 