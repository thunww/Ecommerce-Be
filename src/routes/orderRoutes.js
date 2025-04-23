const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validateOrder = [
    body('shipping_address')
        .notEmpty()
        .withMessage('Thông tin giao hàng là bắt buộc'),

    body('shipping_address.phone')
        .notEmpty()
        .withMessage('Số điện thoại là bắt buộc'),

    body('shipping_address.address_line')
        .notEmpty()
        .withMessage('Địa chỉ là bắt buộc'),

    body('shipping_address.city')
        .notEmpty()
        .withMessage('Thành phố là bắt buộc'),

    body('shipping_address.province')
        .notEmpty()
        .withMessage('Tỉnh là bắt buộc'),

    body('order_items')
        .isArray({ min: 1 })
        .withMessage('Đơn hàng phải có ít nhất một sản phẩm'),

    body('order_items.*.product_id')
        .isInt()
        .withMessage('Mỗi sản phẩm phải có product_id hợp lệ'),

    body('order_items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Số lượng mỗi sản phẩm phải là số nguyên dương'),

    body('order_items.*.price')
        .isFloat({ min: 0 })
        .withMessage('Giá mỗi sản phẩm phải là số hợp lệ'),

    body('payment_method')
        .notEmpty()
        .withMessage('Phương thức thanh toán là bắt buộc')
        .isIn(['cod', 'momo', 'vnpay', 'bank_transfer'])
        .withMessage('Phương thức thanh toán không hợp lệ')
];


// Sử dụng middleware xác thực cho tất cả các routes
router.use(authMiddleware);

router.get("/user", orderController.getUserOrders);

router.post("/create", validateOrder, orderController.createOrder);

router.get("/:order_id", orderController.getOrderDetails);

module.exports = router;
