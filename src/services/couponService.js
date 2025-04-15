const { Coupon, Shop, Order, UserCoupon, User } = require('../models');
const { Op } = require('sequelize');

class CouponService {
    // Lấy tất cả các mã giảm giá với các bộ lọc
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
                    [Op.lt]: new Date(),
                };
            }

            // Tìm kiếm mã giảm giá - tạm thời bỏ shop_id đến khi migration chạy xong
            const coupons = await Coupon.findAll({
                where,
                attributes: ['coupon_id', 'code', 'discount_percent', 'max_discount_amount', 'min_order_value', 'start_date', 'end_date', 'created_at', 'updated_at'],
                order: [['created_at', 'DESC']],
            })

            return coupons;
        } catch (error) {
            throw error;
        }
    }

    // Lấy mã giảm giá theo ID
    async getCouponById(coupon_id) {
        try {
            const coupon = await Coupon.findByPk(coupon_id);

            if (!coupon) {
                throw new Error('Mã giảm giá không tồn tại');
            }

            return coupon;
        } catch (error) {
            throw error;
        }
    }

    // Lấy mã giảm giá theo mã code
    async getCouponByCode(code) {
        try {
            const coupon = await Coupon.findOne({
                where: { code },
                include: [
                    {
                        model: Shop,
                        as: 'shop',
                        attributes: ['shop_id', 'shop_name', 'logo']
                    }
                ]
            });

            if (!coupon) {
                throw new Error('Mã giảm giá không tồn tại');
            }

            return coupon;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin mã giảm giá:', error);
            throw error;
        }
    }

    // Tạo mới mã giảm giá
    async createCoupon(data) {
        try {
            // Kiểm tra mã giảm giá đã tồn tại chưa
            const existingCoupon = await Coupon.findOne({
                where: { code: data.code },
            });

            if (existingCoupon) {
                throw new Error('Mã giảm giá đã tồn tại');
            }

            // Kiểm tra nếu status không hợp lệ
            if (data.status && !['active', 'inactive'].includes(data.status)) {
                throw new Error('Trạng thái mã giảm giá không hợp lệ');
            }

            // Tạo mã giảm giá mới
            const coupon = await Coupon.create({
                code: data.code,
                discount_percent: data.discount_percent,
                max_discount_amount: data.max_discount_amount || null,
                min_order_value: data.min_order_value || null,
                start_date: data.start_date,
                end_date: data.end_date,
                shop_id: data.shop_id || null,
                status: data.status || 'active'
            });

            return await this.getCouponById(coupon.coupon_id);
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật mã giảm giá
    async updateCoupon(coupon_id, data) {
        try {
            const coupon = await this.getCouponById(coupon_id);

            // Kiểm tra mã giảm giá đã tồn tại chưa (nếu thay đổi code)
            if (data.code && data.code !== coupon.code) {
                const existingCoupon = await Coupon.findOne({
                    where: { code: data.code },
                });

                if (existingCoupon) {
                    throw new Error('Mã giảm giá đã tồn tại');
                }
            }

            // Kiểm tra nếu status không hợp lệ
            if (data.status && !['active', 'inactive'].includes(data.status)) {
                throw new Error('Trạng thái mã giảm giá không hợp lệ');
            }

            // Cập nhật mã giảm giá
            await coupon.update(data);

            return await this.getCouponById(coupon_id);
        } catch (error) {
            throw error;
        }
    }

    // Xóa mã giảm giá
    async deleteCoupon(coupon_id) {
        try {
            const coupon = await this.getCouponById(coupon_id);

            // Kiểm tra mã giảm giá đã được sử dụng chưa
            const usedCoupons = await UserCoupon.count({
                where: {
                    coupon_id,
                    used_at: {
                        [Op.not]: null
                    }
                },
            });

            if (usedCoupons > 0) {
                throw new Error('Không thể xóa mã giảm giá đã được sử dụng');
            }

            // Xóa tất cả UserCoupon liên quan
            await UserCoupon.destroy({
                where: { coupon_id }
            });

            // Xóa mã giảm giá
            await coupon.destroy();

            return { message: 'Xóa mã giảm giá thành công' };
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra tính hợp lệ của mã giảm giá (với người dùng và đơn hàng)
    async validateCoupon(code, user_id, total_amount) {
        try {
            const coupon = await this.getCouponByCode(code);

            // Kiểm tra ngày hết hạn
            const now = new Date();
            if (now < coupon.start_date || now > coupon.end_date) {
                throw new Error('Mã giảm giá không còn hiệu lực');
            }

            // Kiểm tra giá trị đơn hàng tối thiểu
            if (coupon.min_order_value && total_amount < coupon.min_order_value) {
                throw new Error(`Đơn hàng tối thiểu ${coupon.min_order_value}đ để áp dụng mã giảm giá này`);
            }

            // Kiểm tra người dùng đã sử dụng mã giảm giá này chưa
            const userCoupon = await UserCoupon.findOne({
                where: {
                    user_id,
                    coupon_id: coupon.coupon_id,
                    used_at: {
                        [Op.not]: null
                    }
                }
            });

            if (userCoupon) {
                throw new Error('Bạn đã sử dụng mã giảm giá này rồi');
            }

            // Tính giá trị giảm giá
            let discount_amount = (total_amount * coupon.discount_percent) / 100;

            // Kiểm tra giới hạn giảm giá tối đa
            if (coupon.max_discount_amount && discount_amount > coupon.max_discount_amount) {
                discount_amount = coupon.max_discount_amount;
            }

            return {
                coupon_id: coupon.coupon_id,
                code: coupon.code,
                discount_percent: coupon.discount_percent,
                discount_amount,
                final_amount: total_amount - discount_amount,
            };
        } catch (error) {
            throw error;
        }
    }

    // Áp dụng mã giảm giá cho đơn hàng
    async applyCouponToOrder(order_id, coupon_code, user_id) {
        try {
            // Lấy thông tin đơn hàng
            const order = await Order.findByPk(order_id);
            if (!order) {
                throw new Error('Đơn hàng không tồn tại');
            }

            // Kiểm tra đơn hàng có thuộc về người dùng không
            if (order.user_id !== user_id) {
                throw new Error('Bạn không có quyền áp dụng mã giảm giá cho đơn hàng này');
            }

            // Kiểm tra mã giảm giá
            const validationResult = await this.validateCoupon(coupon_code, user_id, order.total_amount);

            // Lấy coupon
            const coupon = await this.getCouponByCode(coupon_code);

            // Kiểm tra người dùng đã lưu mã giảm giá này chưa
            let userCoupon = await UserCoupon.findOne({
                where: {
                    user_id,
                    coupon_id: coupon.coupon_id
                }
            });

            // Nếu chưa lưu, tạo mới UserCoupon
            if (!userCoupon) {
                userCoupon = await UserCoupon.create({
                    user_id,
                    coupon_id: coupon.coupon_id
                });
            }

            // Đánh dấu đã sử dụng
            await userCoupon.update({
                used_at: new Date()
            });

            // Cập nhật đơn hàng với coupon
            await order.update({
                coupon_id: coupon.coupon_id,
                discount_amount: validationResult.discount_amount,
                final_amount: validationResult.final_amount
            });

            return {
                order_id,
                coupon_code,
                discount_amount: validationResult.discount_amount,
                final_amount: validationResult.final_amount
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách mã giảm giá của người dùng
    async getUserCoupons(user_id) {
        try {
            const userCoupons = await UserCoupon.findAll({
                where: { user_id },
                include: [{
                    model: Coupon,
                    attributes: ['coupon_id', 'code', 'discount_percent', 'max_discount_amount', 'min_order_value', 'start_date', 'end_date']
                }],
                order: [['created_at', 'DESC']]
            });

            return userCoupons;
        } catch (error) {
            throw error;
        }
    }

    // Người dùng lưu mã giảm giá
    async saveCouponForUser(user_id, coupon_id) {
        try {
            // Kiểm tra mã giảm giá tồn tại không
            const coupon = await this.getCouponById(coupon_id);

            // Kiểm tra người dùng đã lưu mã giảm giá này chưa
            const existingUserCoupon = await UserCoupon.findOne({
                where: {
                    user_id,
                    coupon_id
                }
            });

            if (existingUserCoupon) {
                throw new Error('Bạn đã lưu mã giảm giá này rồi');
            }

            // Tạo mới UserCoupon
            const userCoupon = await UserCoupon.create({
                user_id,
                coupon_id
            });

            return {
                user_coupon_id: userCoupon.user_coupon_id,
                user_id: userCoupon.user_id,
                coupon_id: userCoupon.coupon_id,
                created_at: userCoupon.created_at
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin cửa hàng từ user_id
    async getShopByUserId(user_id) {
        try {
            const shop = await Shop.findOne({
                where: { owner_id: user_id }
            });
            return shop;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CouponService();
