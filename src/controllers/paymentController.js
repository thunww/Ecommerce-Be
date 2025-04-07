const paymentService = require('../services/paymentService');

class PaymentController {
    async getPaymentById(req, res) {
        try {
            const { payment_id } = req.params;
            const payment = await paymentService.getPaymentById(payment_id);
            res.json(payment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPaymentsByOrderId(req, res) {
        try {
            const { order_id } = req.params;
            const payments = await paymentService.getPaymentsByOrderId(order_id);
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async processMomoPayment(req, res) {
        try {
            const { order_id, sub_order_id } = req.params;
            const result = await paymentService.processMomoPayment(order_id, sub_order_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async processVNPayPayment(req, res) {
        try {
            const { order_id, sub_order_id } = req.params;
            const result = await paymentService.processVNPayPayment(order_id, sub_order_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleMomoCallback(req, res) {
        try {
            const data = req.body;
            const result = await paymentService.handleMomoCallback(data);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleVNPayCallback(req, res) {
        try {
            const data = req.query;
            const result = await paymentService.handleVNPayCallback(data);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new PaymentController(); 