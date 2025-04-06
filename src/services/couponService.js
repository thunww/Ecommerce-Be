const { Coupon, Shop, Order } = require('../models');
const { Op } = require('sequelize');

class CouponService {
    async getAllCoupons(filters = {}) {
        try {
            const where = {};

            // Lọc theo trạng thái
            if (filters.status) {
                where.status = filters.status;
            }

            // Lọc theo shop
            if (filters.shop_id) {
                where.shop_id = filters.shop_id;
            }

            // Lọc theo ngày hết hạn
            if (filters.expired) {
                where.end_date = {
                    [Op.lt]: new Date()
                };
            }

            const coupons = await Coupon.findAll({
                where,
                include: [{
                    model: Shop,
                    as: 'shop'
                }],
                order: [['created_at', 'DESC']]
            });

            return coupons;
        } catch (error) {
            throw error;
        }
    }

    async getCouponById(coupon_id) {
        try {
            const coupon = await Coupon.findByPk(coupon_id, {
                include: [{
                    model: Shop,
                    as: 'shop'
                }]
            });

            if (!coupon) {
                throw new Error('Mã giảm giá không tồn tại');
            }

            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async getCouponByCode(code) {
        try {
            const coupon = await Coupon.findOne({
                where: { code },
                include: [{
                    model: Shop,
                    as: 'shop'
                }]
            });

            if (!coupon) {
                throw new Error('Mã giảm giá không tồn tại');
            }

            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async createCoupon(data) {
        try {
            // Kiểm tra mã giảm giá đã tồn tại chưa
            const existingCoupon = await Coupon.findOne({
                where: { code: data.code }
            });

            if (existingCoupon) {
                throw new Error('Mã giảm giá đã tồn tại');
            }

            // Tạo mã giảm giá mới
            const coupon = await Coupon.create(data);

            return await this.getCouponById(coupon.coupon_id);
        } catch (error) {
            throw error;
        }
    }

    async updateCoupon(coupon_id, data) {
        try {
            const coupon = await this.getCouponById(coupon_id);

            // Kiểm tra mã giảm giá đã tồn tại chưa (nếu thay đổi code)
            if (data.code && data.code !== coupon.code) {
                const existingCoupon = await Coupon.findOne({
                    where: { code: data.code }
                });

                if (existingCoupon) {
                    throw new Error('Mã giảm giá đã tồn tại');
                }
            }

            // Cập nhật mã giảm giá
            await coupon.update(data);

            return await this.getCouponById(coupon_id);
        } catch (error) {
            throw error;
        }
    }

    async deleteCoupon(coupon_id) {
        try {
            const coupon = await this.getCouponById(coupon_id);

            // Kiểm tra mã giảm giá đã được sử dụng chưa
            const usedOrders = await Order.count({
                where: { coupon_id }
            });

            if (usedOrders > 0) {
                throw new Error('Không thể xóa mã giảm giá đã được sử dụng');
            }

            // Xóa mã giảm giá
            await coupon.destroy();

            return { message: 'Xóa mã giảm giá thành công' };
        } catch (error) {
            throw error;
        }
    }

    async validateCoupon(code, user_id, total_amount) {
        try {
            const coupon = await this.getCouponByCode(code);

            // Kiểm tra trạng thái
            if (coupon.status !== 'active') {
                throw new Error('Mã giảm giá không còn hiệu lực');
            }

            // Kiểm tra ngày hết hạn
            const now = new Date();
            if (now < coupon.start_date || now > coupon.end_date) {
                throw new Error('Mã giảm giá không còn hiệu lực');
            }

            // Kiểm tra giới hạn sử dụng
            if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
                throw new Error('Mã giảm giá đã hết lượt sử dụng');
            }

            // Kiểm tra giá trị đơn hàng tối thiểu
            if (coupon.min_order_value && total_amount < coupon.min_order_value) {
                throw new Error(`Đơn hàng tối thiểu ${coupon.min_order_value}đ để áp dụng mã giảm giá này`);
            }

            // Tính giá trị giảm giá
            let discount_amount = 0;
            if (coupon.discount_type === 'percentage') {
                discount_amount = (total_amount * coupon.discount_value) / 100;

                // Kiểm tra giới hạn giảm giá tối đa
                if (coupon.max_discount && discount_amount > coupon.max_discount) {
                    discount_amount = coupon.max_discount;
                }
            } else {
                discount_amount = coupon.discount_value;
            }

            return {
                coupon_id: coupon.coupon_id,
                discount_amount,
                final_amount: total_amount - discount_amount
            };
        } catch (error) {
            throw error;
        }
    }

    async applyCoupon(order_id, coupon_id) {
        try {
            const coupon = await this.getCouponById(coupon_id);

            // Cập nhật số lần sử dụng
            await coupon.increment('used_count');

            // Cập nhật trạng thái nếu đã hết lượt sử dụng
            if (coupon.usage_limit && coupon.used_count + 1 >= coupon.usage_limit) {
                await coupon.update({ status: 'inactive' });
            }

            return { message: 'Áp dụng mã giảm giá thành công' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CouponService(); 