const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy thông tin thanh toán theo ID
router.get('/:payment_id', authMiddleware, paymentController.getPaymentById);

// Lấy danh sách thanh toán theo đơn hàng
router.get('/order/:order_id', authMiddleware, paymentController.getPaymentsByOrderId);

// Xử lý thanh toán qua Momo
router.post('/momo/:order_id/:sub_order_id', authMiddleware, paymentController.processMomoPayment);

// Xử lý thanh toán qua VNPay
router.post('/vnpay/:order_id/', authMiddleware, paymentController.processVNPayPayment);

// Callback từ Momo
router.post('/momo/callback', paymentController.handleMomoCallback);

// Callback từ VNPay
router.get('/vnpay/callback', paymentController.handleVNPayCallback);

module.exports = router;