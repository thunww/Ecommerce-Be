const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Middleware validation
const validateOrder = [
    body('shipping_address_id')
        .notEmpty()
        .withMessage('Địa chỉ giao hàng là bắt buộc')
        .isInt()
        .withMessage('Địa chỉ giao hàng không hợp lệ'),
    body('payment_method')
        .notEmpty()
        .withMessage('Phương thức thanh toán là bắt buộc')
        .isIn(['cod', 'momo', 'vnpay', 'bank_transfer'])
        .withMessage('Phương thức thanh toán không hợp lệ')
];

// Sử dụng middleware xác thực cho tất cả các routes
router.use(authMiddleware);

// Routes
router.post('/create',
    validateOrder,
    orderController.createOrder
);

router.get('/:order_id',
    orderController.getOrderDetails
);

router.get('/user/orders',
    orderController.getUserOrders
);

module.exports = router; 