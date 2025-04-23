const express = require('express');
const router = express.Router();
const shipperController = require('../controllers/shipperController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/upload');

// Đăng ký shipper
router.post('/register', authMiddleware, shipperController.registerShipper);

// Lấy thông tin shipper
router.get('/profile', authMiddleware, roleMiddleware(['shipper']), shipperController.getShipperProfile);

// Cập nhật thông tin shipper
router.put('/profile', authMiddleware, roleMiddleware(['shipper']), shipperController.updateShipperProfile);

// Cập nhật avatar shipper
router.put('/profile/avatar', authMiddleware, roleMiddleware(['shipper']), upload.single('avatar'), shipperController.updateAvatar);

// Lấy thống kê dashboard
router.get('/dashboard/stats', authMiddleware, roleMiddleware(['shipper']), shipperController.getDashboardStats);

// Lấy danh sách sub_orders
router.get('/sub_orders', authMiddleware, shipperController.getOrders);

// Lọc sub_orders theo khu vực
router.get('/sub_orders/filter', authMiddleware, shipperController.filterOrdersByArea);

// Tìm kiếm sub_order
router.get('/sub_orders/search', authMiddleware, shipperController.searchOrder);

// Lấy chi tiết sub_order
router.get('/sub_orders/:orderId', authMiddleware, shipperController.getOrderDetails);

// Nhận sub_order
router.post('/sub_orders/:orderId/accept', authMiddleware, shipperController.acceptOrder);

// Hoàn thành sub_order
router.put('/sub_orders/:orderId/complete', authMiddleware, shipperController.completeOrder);
router.post('/sub_orders/:orderId/complete', authMiddleware, shipperController.completeOrder);

// Hủy sub_order
router.post('/sub_orders/:orderId/cancel', authMiddleware, shipperController.cancelOrder);

// Xem lịch sử sub_orders
router.get('/sub_orders/history', authMiddleware, shipperController.getOrderHistory);

// Lấy thống kê thu nhập
router.get('/income/stats', authMiddleware, shipperController.getIncomeStats);

// Lấy chi tiết thu nhập từ sub_order
router.get('/income/sub_orders/:order_id', authMiddleware, shipperController.getIncomeDetails);

// Lọc thu nhập theo ngày
router.get('/income/filter', authMiddleware, shipperController.filterIncomeByDate);

module.exports = router; // Export router để sử dụng trong ứng dụng