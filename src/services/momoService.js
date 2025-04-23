// File: services/momoService.js
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const { Order } = require('../models');

const momoService = {
    async createMomoPayment(order) {
        try {
            const partnerCode = process.env.MOMO_PARTNER_CODE;
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretKey = process.env.MOMO_SECRET_KEY;
            const redirectUrl = process.env.MOMO_REDIRECT_URL;
            const ipnUrl = process.env.MOMO_IPN_URL;

            const requestId = partnerCode + new Date().getTime();
            const orderId = 'order_' + order.order_id + '_' + new Date().getTime();
            const orderInfo = 'Thanh toán đơn hàng #' + order.order_id;
            const amount = order.total_price.toString();
            const requestType = 'captureWallet';
            const extraData = '';

            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
            const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'vi'
            };

            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.resultCode === 0) {
                return response.data.payUrl;
            } else {
                console.error('⚠️ Lỗi thanh toán Momo:', response.data);
                throw new Error(response.data.message || 'Thanh toán thất bại');
            }
        } catch (error) {
            console.error('❌ Lỗi trong createMomoPayment:', error.response?.data || error.message);
            throw error;
        }
    },

    async handleMomoIPN(req, res) {
        try {
            const data = req.body;
            const {
                orderId,
                resultCode,
                signature,
                amount,
                extraData,
                message,
                requestId,
                orderInfo,
                partnerCode,
                redirectUrl,
                ipnUrl,
                requestType,
                responseTime,
                transId,
                payType
            } = data;

            const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
            const expectedSignature = crypto.createHmac('sha256', process.env.MOMO_SECRET_KEY).update(rawSignature).digest('hex');

            if (signature !== expectedSignature) {
                console.warn('⚠️ IPN MoMo sai chữ ký!');
                return res.status(400).json({ message: 'Invalid signature' });
            }

            if (resultCode === 0) {
                const extractedOrderId = parseInt(orderId.split('_')[1]);
                await Order.update({ status: 'paid' }, { where: { order_id: extractedOrderId } });
                console.log('✅ Đã cập nhật đơn hàng thành công');
            }

            return res.status(200).json({ message: 'Callback received' });
        } catch (error) {
            console.error('❌ Lỗi xử lý IPN Momo:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = momoService;