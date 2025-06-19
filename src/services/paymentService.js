const { Payment, Order, SubOrder } = require('../models');
const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/config');


const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

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

    async processVNPayPayment(order_id) {
        try {

            const vnpay = new VNPay({
                tmnCode: process.env.VNPAY_TMN_CODE,
                secureSecret: process.env.VNPAY_HASH_SECRET,
                vnpayHost: process.env.VNPAY_URL,
                testMode: true,
                hashAlgorithm: 'SHA512',

                ignoreLogger: ignoreLogger,
            });
            const order = await Order.findByPk(order_id);
            if (!order) {
                throw new Error('Không tìm thấy đơn hàng');
            }
             const now = new Date();
            const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // GMT+7
            const createDate = dateFormat(vnTime, 'yyyyMMddHHmmss');
            const expireDate = dateFormat(new Date(vnTime.getTime() + 30 * 60 * 1000), 'yyyyMMddHHmmss');

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: order.total_price,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: `${order_id}`,
            vnp_OrderInfo: `Thanh toán đơn hàng #${order_id}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `http://localhost:5173/payment`,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate,
        });

            return {
                message: 'Đơn hàng đã được tạo, vui lòng thanh toán',
                order_id,
                payment_url: vnpayResponse,
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


            const {
                vnp_TxnRef,       // order_id
                vnp_ResponseCode, // mã trạng thái giao dịch
                vnp_SecureHash,   // hash kiểm tra (nên verify)
                // ...các tham số khác nếu cần
            } = data;

            // TODO: Verify vnp_SecureHash để đảm bảo callback hợp lệ

            // Tìm đơn hàng theo vnp_TxnRef (order_id)
            const order = await Order.findByPk(vnp_TxnRef);
            if (!order) {
                console.error('Không tìm thấy đơn hàng với id:', vnp_TxnRef);
                // Trả về lỗi theo chuẩn VNPAY nếu cần
                return { code: '91', message: 'Không tìm thấy giao dịch yêu cầu' };
            }

            // Cập nhật trạng thái đơn hàng theo vnp_ResponseCode
            switch (vnp_ResponseCode) {
                case '00': // Giao dịch thành công
                case '07': // Trừ tiền thành công, giao dịch nghi ngờ
                    order.payment_status = 'paid';

                    break;
                case '09':
                case '10':
                case '11':
                case '12':
                case '13':
                case '24':
                case '51':
                case '65':
                case '75':
                case '79':
                case '99':
                    order.payment_status = 'failed';

                    break;
                default:
                    order.payment_status = 'unknown';

            }

            await order.save();

            // Trả về response theo chuẩn VNPAY
            if (vnp_ResponseCode === '00' || vnp_ResponseCode === '07') {
                return { code: '00', message: 'Giao dịch thành công' };
            } else {
                return { code: vnp_ResponseCode, message: 'Giao dịch không thành công' };
            }

        } catch (error) {
            console.error('Lỗi xử lý callback VNPay:', error);
            return { code: '99', message: 'Lỗi hệ thống' };
        }
    }

}

module.exports = new PaymentService(); 
