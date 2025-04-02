const { Payment, Order } = require('../models');

class PaymentService {
    async createPayment(order_id, payment_method, amount) {
        // Kiểm tra đơn hàng có tồn tại không
        const order = await Order.findByPk(order_id);
        if (!order) {
            throw new Error('Không tìm thấy đơn hàng');
        }

        // Kiểm tra số tiền thanh toán có hợp lệ không
        if (amount !== order.total_amount) {
            throw new Error('Số tiền thanh toán không hợp lệ');
        }

        // Tạo thanh toán mới
        const payment = await Payment.create({
            order_id,
            payment_method,
            amount,
            status: 'pending'
        });

        // TODO: Tích hợp với cổng thanh toán thực tế
        // Sau khi thanh toán thành công, cập nhật trạng thái
        payment.status = 'completed';
        await payment.save();

        // Cập nhật trạng thái đơn hàng
        order.status = 'paid';
        await order.save();

        return payment;
    }

    async getPaymentHistory(user_id) {
        return await Payment.findAll({
            include: [
                {
                    model: Order,
                    as: 'order',
                    where: { user_id },
                    required: true
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async getPaymentById(payment_id) {
        return await Payment.findByPk(payment_id, {
            include: [
                {
                    model: Order,
                    as: 'order'
                }
            ]
        });
    }
}

module.exports = new PaymentService(); 