const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const shopAuthMiddleware = require('../middleware/shopAuthMiddleware');

// ===================== PUBLIC ROUTES =====================
// Lấy danh sách tất cả mã giảm giá 
router.get('/', couponController.getAllCoupons);

// Lấy thông tin mã giảm giá theo ID
router.get('/:coupon_id', couponController.getCouponById);

// Lấy thông tin mã giảm giá theo mã code
router.get('/code/:code', couponController.getCouponByCode);

// ===================== USER ROUTES =====================
// Kiểm tra tính hợp lệ của mã giảm giá
router.post('/validate/:code', authMiddleware, couponController.validateCoupon);

// Lấy danh sách mã giảm giá của người dùng
router.get('/user/coupons', authMiddleware, couponController.getUserCoupons);

// Lưu mã giảm giá vào danh sách người dùng
router.post('/user/save/:coupon_id', authMiddleware, couponController.saveCoupon);

// Áp dụng mã giảm giá vào đơn hàng
router.post('/apply', authMiddleware, couponController.applyCoupon);

// Lấy danh sách mã giảm giá hợp lệ cho giỏ hàng
router.get('/valid-for-cart', authMiddleware, couponController.getValidCouponsForCart);

// ===================== ADMIN ROUTES =====================
// Tạo mã giảm giá mới (admin)
router.post('/admin', authMiddleware, roleMiddleware(["admin"]), couponController.createCoupon);

// Cập nhật mã giảm giá (admin)
router.put('/admin/:coupon_id', authMiddleware, roleMiddleware(["admin"]), couponController.updateCoupon);

// Xóa mã giảm giá (admin)
router.delete('/admin/:coupon_id', authMiddleware, roleMiddleware(["admin"]), couponController.deleteCoupon);

// ===================== SHOP ROUTES =====================
// Tạo mã giảm giá mới (shop)
router.post('/shop', authMiddleware, roleMiddleware(["vendor"]), couponController.createCoupon);

// Cập nhật mã giảm giá (shop - chỉ coupon của shop đó)
router.put('/shop/:coupon_id', authMiddleware, roleMiddleware(["vendor"]), couponController.updateCoupon);

// Xóa mã giảm giá (shop - chỉ coupon của shop đó)
router.delete('/shop/:coupon_id', authMiddleware, roleMiddleware(["vendor"]), couponController.deleteCoupon);

module.exports = router; 