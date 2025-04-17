//Quản lí đơn hàng, thanh toán, vận chuyển

const orderService = require('../services/orderService');
const { validationResult } = require('express-validator');
const Order = require('../models/order');
const shippingService = require('../services/shippingService');
const OrderItem = require('../models/orderItem');
const Product = require('../models/product');

class OrderController {
    async createOrder(req, res) {
        try {
            const { shipping_address_id, payment_method, coupon_code } = req.body;
            const user_id = req.user.user_id;

            // Validate payment method
            if (!['cod', 'momo', 'vnpay', 'bank_transfer'].includes(payment_method)) {
                return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
            }

            // Lấy thông tin sản phẩm bao gồm trọng lượng
            const orderItemsWithWeight = await Promise.all(req.body.order_items.map(async (item) => {
                const product = await Product.findByPk(item.product_id);
                if (!product) {
                    throw new Error(`Không tìm thấy sản phẩm với ID: ${item.product_id}`);
                }
                return {
                    ...item,
                    product: {
                        weight: product.weight
                    }
                };
            }));

            // Tính phí vận chuyển
            const shippingDetails = await shippingService.calculateShippingFee({
                order_items: orderItemsWithWeight
            });

            // Tạo đơn hàng mới
            const order = await Order.create({
                user_id,
                shipping_address_id,
                payment_method,
                status: 'pending',
                shipping_fee: shippingDetails.shippingFee,
                total_amount: req.body.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingDetails.shippingFee
            });

            // Thêm chi tiết đơn hàng
            await Promise.all(req.body.order_items.map(item => 
                OrderItem.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                })
            ));

            // Nếu là thanh toán online, trả về URL thanh toán
            if (payment_method !== 'cod' && order.payment_url) {
                return res.status(200).json({
                    message: 'Đơn hàng đã được tạo, vui lòng thanh toán',
                    order_id: order.id,
                    payment_url: order.payment_url,
                    shipping_details: shippingDetails
                });
            }

            res.status(201).json({
                ...order.toJSON(),
                shipping_details: shippingDetails
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOrderDetails(req, res) {
        try {
            const { order_id } = req.params;
            const user_id = req.user.user_id;

            const order = await orderService.getOrderDetails(order_id);

            // Kiểm tra xem đơn hàng có thuộc về người dùng không
            if (order.user_id !== user_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền xem đơn hàng này'
                });
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getUserOrders(req, res) {
        try {
            const user_id = req.user.user_id;
            const orders = await orderService.getUserOrders(user_id);

            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new OrderController();