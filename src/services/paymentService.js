const { Payment, Order, SubOrder } = require('../models');
const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/config');

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
        try {
            const payment = await Payment.findByPk(payment_id, {
                include: [{
                    model: Order,
                    as: 'order'
                }, {
                    model: SubOrder,
                    as: 'subOrder'
                }]
            });

            if (!payment) {
                throw new Error('Thanh toán không tồn tại');
            }

            return payment;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentsByOrderId(order_id) {
        try {
            const payments = await Payment.findAll({
                where: { order_id },
                include: [{
                    model: SubOrder,
                    as: 'subOrder'
                }]
            });

            return payments;
        } catch (error) {
            throw error;
        }
    }

    async updatePaymentStatus(payment_id, status) {
        try {
            const payment = await this.getPaymentById(payment_id);

            // Cập nhật trạng thái thanh toán
            await payment.update({ status });

            // Cập nhật trạng thái đơn hàng nếu tất cả thanh toán đã hoàn thành
            if (status === 'paid') {
                const order = await Order.findByPk(payment.order_id);
                const payments = await this.getPaymentsByOrderId(payment.order_id);

                // Kiểm tra xem tất cả thanh toán đã hoàn thành chưa
                const allPaid = payments.every(p => p.status === 'paid');

                if (allPaid) {
                    await order.update({
                        payment_status: 'paid',
                        status: 'processing'
                    });
                }
            }

            return await this.getPaymentById(payment_id);
        } catch (error) {
            throw error;
        }
    }

    async processMomoPayment(order_id, sub_order_id) {
        try {
            const payment = await Payment.findOne({
                where: { order_id, sub_order_id }
            });

            if (!payment) {
                throw new Error('Thanh toán không tồn tại');
            }

            if (payment.status !== 'pending') {
                throw new Error('Thanh toán không ở trạng thái chờ xử lý');
            }

            // Tạo mã đơn hàng
            const orderInfo = `Thanh toán đơn hàng #${order_id}`;
            const amount = payment.amount;
            const orderId = `MOMO_${Date.now()}`;
            const orderType = 'momo_wallet';
            const transId = `MOMO_${Date.now()}`;
            const requestType = 'captureWallet';
            const extraData = JSON.stringify({
                order_id,
                sub_order_id,
                payment_id: payment.payment_id
            });

            // Tạo chữ ký
            const rawHash = `partnerCode=${config.momo.partnerCode}&accessKey=${config.momo.accessKey}&requestId=${orderId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&transId=${transId}&requestType=${requestType}&extraData=${extraData}`;
            const signature = crypto.createHmac('sha256', config.momo.secretKey).update(rawHash).digest('hex');

            // Gọi API Momo
            const response = await axios.post(config.momo.endpoint, {
                partnerCode: config.momo.partnerCode,
                accessKey: config.momo.accessKey,
                requestId: orderId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                orderType: orderType,
                transId: transId,
                requestType: requestType,
                extraData: extraData,
                signature: signature
            });

            // Lưu thông tin thanh toán
            await payment.update({
                transaction_id: response.data.transId,
                payment_url: response.data.payUrl,
                payment_data: JSON.stringify(response.data)
            });

            return {
                payment_id: payment.payment_id,
                payment_url: response.data.payUrl
            };
        } catch (error) {
            throw error;
        }
    }

    async processVNPayPayment(order_id, sub_order_id) {
        try {
            const payment = await Payment.findOne({
                where: { order_id, sub_order_id }
            });

            if (!payment) {
                throw new Error('Thanh toán không tồn tại');
            }

            if (payment.status !== 'pending') {
                throw new Error('Thanh toán không ở trạng thái chờ xử lý');
            }

            // Tạo mã đơn hàng
            const orderInfo = `Thanh toán đơn hàng #${order_id}`;
            const amount = payment.amount * 100; // VNPay yêu cầu số tiền là số nguyên
            const orderId = `VNPAY_${Date.now()}`;
            const orderType = 'billpayment';
            const transId = `VNPAY_${Date.now()}`;
            const ipAddr = '127.0.0.1'; // Cần thay đổi thành IP thực tế
            const extraData = JSON.stringify({
                order_id,
                sub_order_id,
                payment_id: payment.payment_id
            });

            // Tạo URL thanh toán
            const vnpUrl = config.vnpay.endpoint;
            const returnUrl = `${config.app.baseUrl}/api/payment/vnpay/callback`;
            const tmnCode = config.vnpay.tmnCode;
            const secretKey = config.vnpay.secretKey;
            const vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: tmnCode,
                vnp_Locale: 'vn',
                vnp_CurrCode: 'VND',
                vnp_TxnRef: transId,
                vnp_OrderInfo: orderInfo,
                vnp_OrderType: orderType,
                vnp_Amount: amount,
                vnp_ReturnUrl: returnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
                vnp_ExtraData: extraData
            };

            // Sắp xếp các tham số theo thứ tự alphabet
            const sortedParams = Object.keys(vnp_Params).sort().reduce((acc, key) => {
                acc[key] = vnp_Params[key];
                return acc;
            }, {});

            // Tạo chuỗi hash
            let hashData = '';
            for (const key in sortedParams) {
                if (sortedParams[key]) {
                    hashData += key + '=' + encodeURIComponent(sortedParams[key]) + '&';
                }
            }
            hashData += 'vnp_SecureHash=' + crypto.createHmac('sha512', secretKey).update(hashData).digest('hex');

            // Tạo URL thanh toán
            const paymentUrl = `${vnpUrl}?${hashData}`;

            // Lưu thông tin thanh toán
            await payment.update({
                transaction_id: transId,
                payment_url: paymentUrl,
                payment_data: JSON.stringify(vnp_Params)
            });

            return {
                payment_id: payment.payment_id,
                payment_url: paymentUrl
            };
        } catch (error) {
            throw error;
        }
    }

    async handleMomoCallback(data) {
        try {
            // Kiểm tra chữ ký
            const rawHash = `partnerCode=${data.partnerCode}&accessKey=${data.accessKey}&requestId=${data.requestId}&amount=${data.amount}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&transId=${data.transId}&requestType=${data.requestType}&extraData=${data.extraData}`;
            const signature = crypto.createHmac('sha256', config.momo.secretKey).update(rawHash).digest('hex');

            if (signature !== data.signature) {
                throw new Error('Chữ ký không hợp lệ');
            }

            // Lấy thông tin thanh toán
            const extraData = JSON.parse(data.extraData);
            const payment = await this.getPaymentById(extraData.payment_id);

            // Cập nhật trạng thái thanh toán
            if (data.resultCode === 0) {
                await this.updatePaymentStatus(payment.payment_id, 'paid');
                return { success: true, message: 'Thanh toán thành công' };
            } else {
                await this.updatePaymentStatus(payment.payment_id, 'failed');
                return { success: false, message: 'Thanh toán thất bại' };
            }
        } catch (error) {
            throw error;
        }
    }

    async handleVNPayCallback(data) {
        try {
            // Kiểm tra chữ ký
            const vnp_SecureHash = data.vnp_SecureHash;
            delete data.vnp_SecureHash;
            delete data.vnp_SecureHashType;

            // Sắp xếp các tham số theo thứ tự alphabet
            const sortedParams = Object.keys(data).sort().reduce((acc, key) => {
                acc[key] = data[key];
                return acc;
            }, {});

            // Tạo chuỗi hash
            let hashData = '';
            for (const key in sortedParams) {
                if (sortedParams[key]) {
                    hashData += key + '=' + encodeURIComponent(sortedParams[key]) + '&';
                }
            }
            const signature = crypto.createHmac('sha512', config.vnpay.secretKey).update(hashData).digest('hex');

            if (signature !== vnp_SecureHash) {
                throw new Error('Chữ ký không hợp lệ');
            }

            // Lấy thông tin thanh toán
            const extraData = JSON.parse(data.vnp_ExtraData);
            const payment = await this.getPaymentById(extraData.payment_id);

            // Cập nhật trạng thái thanh toán
            if (data.vnp_ResponseCode === '00') {
                await this.updatePaymentStatus(payment.payment_id, 'paid');
                return { success: true, message: 'Thanh toán thành công' };
            } else {
                await this.updatePaymentStatus(payment.payment_id, 'failed');
                return { success: false, message: 'Thanh toán thất bại' };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PaymentService(); 