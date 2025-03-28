const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
    try {
        const { order_id, payment_method, amount } = req.body;
        const payment = await paymentService.createPayment(order_id, payment_method, amount);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await paymentService.getPaymentHistory(req.user.user_id);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin thanh toán' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 