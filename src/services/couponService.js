const { Coupon, Shop, Order, UserCoupon, User } = require("../models");
const { Op } = require("sequelize");

class CouponService {
    // Lấy tất cả các mã giảm giá với các bộ lọc
    async getAllCoupons(filters = {}) {
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.shop_id) where.shop_id = filters.shop_id;
        if (filters.expired) {
            where.end_date = { [Op.lt]: new Date() };
        }

        const coupons = await Coupon.findAll({
            where,
            attributes: [
                "coupon_id",
                "code",
                "discount_percent",
                "max_discount_amount",
                "min_order_value",
                "start_date",
                "end_date",
                "status",
                "created_at",
                "updated_at",
            ],
            include: [
                {
                    model: Shop,
                    as: "shop",
                    attributes: ["shop_id", "shop_name"],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        return coupons;
    }

    async getCouponById(coupon_id) {
        const coupon = await Coupon.findByPk(coupon_id);
        if (!coupon) throw new Error("Mã giảm giá không tồn tại");
        return coupon;
    }

    async getCouponByCode(code) {
        const coupon = await Coupon.findOne({
            where: { code },
            include: [
                {
                    model: Shop,
                    as: "shop",
                    attributes: ["shop_id", "shop_name", "logo"],
                },
            ],
        });
        if (!coupon) throw new Error("Mã giảm giá không tồn tại");
        return coupon;
    }

    async createCoupon(data) {
        const exists = await Coupon.findOne({ where: { code: data.code } });
        if (exists) throw new Error('Mã giảm giá đã tồn tại');

        if (data.status && !["active", "inactive"].includes(data.status)) {
            throw new Error("Trạng thái mã giảm giá không hợp lệ");
        }

        const coupon = await Coupon.create({
            code: data.code,
            discount_percent: data.discount_percent,
            max_discount_amount: data.max_discount_amount || null,
            min_order_value: data.min_order_value || null,
            start_date: data.start_date,
            end_date: data.end_date,
            shop_id: data.shop_id || null,
            status: data.status || "active",
        });

        return this.getCouponById(coupon.coupon_id);
    }

    async updateCoupon(coupon_id, data) {
        const coupon = await this.getCouponById(coupon_id);

        if (data.code && data.code !== coupon.code) {
            const exists = await Coupon.findOne({ where: { code: data.code } });
            if (exists) throw new Error("Mã giảm giá đã tồn tại");
        }

        if (data.status && !["active", "inactive"].includes(data.status)) {
            throw new Error("Trạng thái mã giảm giá không hợp lệ");
        }

        await coupon.update(data);
        return this.getCouponById(coupon_id);
    }

    async deleteCoupon(coupon_id) {
        const coupon = await this.getCouponById(coupon_id);
        const usedCount = await UserCoupon.count({
            where: {
                coupon_id,
                used_at: { [Op.not]: null },
            },
        });

        if (usedCount > 0)
            throw new Error("Không thể xóa mã giảm giá đã được sử dụng");

        await UserCoupon.destroy({ where: { coupon_id } });
        await coupon.destroy();

        return { message: "Xóa mã giảm giá thành công" };
    }

    async validateCoupon(code, user_id, total_amount) {
        const coupon = await this.getCouponByCode(code);

        const now = new Date();
        if (coupon.status !== "active")
            throw new Error("Mã giảm giá không khả dụng");
        if (now < coupon.start_date || now > coupon.end_date) {
            throw new Error("Mã giảm giá không còn hiệu lực");
        }

        if (coupon.min_order_value && total_amount < coupon.min_order_value) {
            throw new Error(
                `Đơn hàng tối thiểu ${coupon.min_order_value}đ để áp dụng mã`
            );
        }

        const alreadyUsed = await UserCoupon.findOne({
            where: {
                user_id,
                coupon_id: coupon.coupon_id,
                used_at: { [Op.not]: null },
            },
        });

        if (alreadyUsed) throw new Error("Bạn đã sử dụng mã này rồi");

        let discount_amount = (total_amount * coupon.discount_percent) / 100;
        if (
            coupon.max_discount_amount &&
            discount_amount > coupon.max_discount_amount
        ) {
            discount_amount = coupon.max_discount_amount;
        }

        return {
            coupon_id: coupon.coupon_id,
            code: coupon.code,
            discount_percent: coupon.discount_percent,
            max_discount_amount: coupon.max_discount_amount,
            discount_amount,
            final_amount: total_amount - discount_amount,
        };
    }

    async applyCouponToOrder(order_id, coupon_code, user_id) {
        const order = await Order.findByPk(order_id);
        if (!order) throw new Error("Đơn hàng không tồn tại");

        if (order.user_id !== user_id) {
            throw new Error("Bạn không có quyền áp dụng mã cho đơn hàng này");
        }

        const coupon = await this.getCouponByCode(coupon_code);
        const now = new Date();

        // Kiểm tra thời gian hiệu lực
        if (now < coupon.start_date || now > coupon.end_date) {
            throw new Error("Mã giảm giá không còn hiệu lực");
        }

        // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
        if (coupon.min_order_value && order.total_amount < coupon.min_order_value) {
            throw new Error(
                `Cần đơn hàng tối thiểu ${coupon.min_order_value}đ để dùng mã này`
            );
        }

        // Kiểm tra người dùng đã sử dụng mã chưa
        const userUsed = await UserCoupon.findOne({
            where: {
                user_id,
                coupon_id: coupon.coupon_id,
                used_at: { [Op.not]: null },
            },
        });

        if (userUsed) {
            throw new Error("Bạn đã sử dụng mã giảm giá này");
        }

        // Tính giảm giá
        let discount = (order.total_amount * coupon.discount_percent) / 100;
        if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
            discount = coupon.max_discount_amount;
        }

        const final_amount = order.total_amount - discount;

        // Lưu UserCoupon nếu chưa tồn tại
        const [userCoupon] = await UserCoupon.findOrCreate({
            where: { user_id, coupon_id: coupon.coupon_id },
            defaults: { user_id, coupon_id: coupon.coupon_id },
        });

        // Đánh dấu đã sử dụng
        await userCoupon.update({ used_at: new Date() });

        // Cập nhật đơn hàng
        await order.update({
            coupon_id: coupon.coupon_id,
            discount_amount: discount,
            final_amount: final_amount,
        });

        return {
            order_id: order.order_id,
            coupon: {
                code: coupon.code,
                discount_type: "percentage",
                discount_value: coupon.discount_percent,
                max_discount: coupon.max_discount_amount,
            },
            discount,
            final_amount,
        };
    }

    async getUserCoupons(user_id) {
        const list = await UserCoupon.findAll({
            where: { user_id },
            include: [
                {
                    model: Coupon,
                    attributes: [
                        "coupon_id",
                        "code",
                        "discount_percent",
                        "max_discount_amount",
                        "min_order_value",
                        "start_date",
                        "end_date",
                        "status",
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });
        return list;
    }

    async saveCouponForUser(user_id, coupon_id) {
        await this.getCouponById(coupon_id);

        const exists = await UserCoupon.findOne({ where: { user_id, coupon_id } });
        if (exists) throw new Error("Bạn đã lưu mã giảm giá này rồi");

        const userCoupon = await UserCoupon.create({ user_id, coupon_id });
        return {
            user_coupon_id: userCoupon.user_coupon_id,
            user_id,
            coupon_id,
            created_at: userCoupon.created_at,
        };
    }

    async getShopByUserId(user_id) {
        return await Shop.findOne({ where: { owner_id: user_id } });
    }
}

module.exports = new CouponService();
