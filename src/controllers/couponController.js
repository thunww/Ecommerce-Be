const couponService = require('../services/couponService');
const cartService = require('../services/cartService');
const { UserCoupon } = require('../models');
const { Op } = require('sequelize');

const getAllCoupons = async (req, res) => {
    try {
        // Lấy các tham số filter từ query params
        const filters = {
            status: req.query.status,
            expired: req.query.expired === 'true',
            shop_id: req.query.shop_id
        };

        const coupons = await couponService.getAllCoupons(filters);
        return res.status(200).json({
            status: 'success',
            message: 'Lấy danh sách mã giảm giá thành công',
            data: coupons
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi lấy danh sách mã giảm giá'
        });
    }
};

const getCouponById = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const coupon = await couponService.getCouponById(coupon_id);
        return res.status(200).json({
            status: 'success',
            message: 'Lấy thông tin mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin mã giảm giá:', error);
        if (error.message === 'Mã giảm giá không tồn tại') {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi lấy thông tin mã giảm giá'
        });
    }
};

const getCouponByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await couponService.getCouponByCode(code);
        return res.status(200).json({
            status: 'success',
            message: 'Lấy thông tin mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin mã giảm giá:', error);
        if (error.message === 'Mã giảm giá không tồn tại') {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi lấy thông tin mã giảm giá'
        });
    }
};

const createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        const user = req.user;

        // Nếu URL là /shop thì người dùng là shop owner
        if (req.originalUrl.includes('/shop')) {
            // Lấy shop_id của người dùng
            const shopOwner = await couponService.getShopByUserId(user.user_id);
            if (!shopOwner) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền tạo mã giảm giá'
                });
            }
            couponData.shop_id = shopOwner.shop_id;
        }

        // Admin có thể tạo coupon cho bất kỳ shop nào hoặc coupon toàn hệ thống (shop_id = null)

        const coupon = await couponService.createCoupon(couponData);
        return res.status(201).json({
            status: 'success',
            message: 'Tạo mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi tạo mã giảm giá:', error);
        if (error.message === 'Mã giảm giá đã tồn tại' || error.message === 'Trạng thái mã giảm giá không hợp lệ') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi tạo mã giảm giá'
        });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const updateData = req.body;
        const user = req.user;

        // Nếu URL là /shop thì người dùng là shop owner, cần kiểm tra quyền
        if (req.originalUrl.includes('/shop')) {
            const shopOwner = await couponService.getShopByUserId(user.user_id);
            const coupon = await couponService.getCouponById(coupon_id);

            if (!shopOwner || coupon.shop_id !== shopOwner.shop_id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền cập nhật mã giảm giá này'
                });
            }
        }

        const coupon = await couponService.updateCoupon(coupon_id, updateData);
        return res.status(200).json({
            status: 'success',
            message: 'Cập nhật mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật mã giảm giá:', error);
        if (error.message === 'Mã giảm giá không tồn tại') {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
        if (error.message === 'Mã giảm giá đã tồn tại' || error.message === 'Trạng thái mã giảm giá không hợp lệ') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi cập nhật mã giảm giá'
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const user = req.user;

        // Nếu URL là /shop thì người dùng là shop owner, cần kiểm tra quyền
        if (req.originalUrl.includes('/shop')) {
            const shopOwner = await couponService.getShopByUserId(user.user_id);
            const coupon = await couponService.getCouponById(coupon_id);

            if (!shopOwner || coupon.shop_id !== shopOwner.shop_id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Bạn không có quyền xóa mã giảm giá này'
                });
            }
        }

        const result = await couponService.deleteCoupon(coupon_id);
        return res.status(200).json({
            status: 'success',
            message: 'Xóa mã giảm giá thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa mã giảm giá:', error);
        if (error.message === 'Mã giảm giá không tồn tại') {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
        if (error.message === 'Không thể xóa mã giảm giá đã được sử dụng') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi xóa mã giảm giá'
        });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const user_id = req.user.user_id;
        let { total_amount } = req.body;

        // Nếu không có total_amount trực tiếp, lấy từ giỏ hàng của người dùng
        if (!total_amount) {
            const cart = await cartService.getCartWithItems(user_id);
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Giỏ hàng trống, không thể áp dụng mã giảm giá'
                });
            }

            // Tính tổng tiền từ giỏ hàng
            total_amount = parseFloat(cart.total_price || 0);

            if (total_amount <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Giá trị giỏ hàng phải lớn hơn 0'
                });
            }
        }

        const result = await couponService.validateCoupon(code, user_id, total_amount);
        return res.status(200).json({
            status: 'success',
            message: 'Mã giảm giá hợp lệ',
            data: {
                ...result,
                cart_total: total_amount,
                discount_amount: result.discount_amount,
                final_amount: result.final_amount
            }
        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra mã giảm giá:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Lấy danh sách mã giảm giá của người dùng
const getUserCoupons = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const coupons = await couponService.getUserCoupons(user_id);
        return res.status(200).json({
            status: 'success',
            message: 'Lấy danh sách mã giảm giá của người dùng thành công',
            data: coupons
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách mã giảm giá của người dùng:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi lấy danh sách mã giảm giá của người dùng'
        });
    }
};

// Người dùng lưu mã giảm giá vào danh sách của mình
const saveCoupon = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { coupon_id } = req.params;

        const result = await couponService.saveCouponForUser(user_id, coupon_id);
        return res.status(200).json({
            status: 'success',
            message: 'Lưu mã giảm giá thành công',
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi lưu mã giảm giá:', error);
        if (error.message === 'Mã giảm giá không tồn tại') {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
        if (error.message === 'Bạn đã lưu mã giảm giá này rồi') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi lưu mã giảm giá'
        });
    }
};

// Áp dụng mã giảm giá vào đơn hàng
const applyCoupon = async (req, res) => {
    try {
        const { order_id, coupon_code } = req.body;
        const user_id = req.user.user_id;

        const result = await couponService.applyCouponToOrder(order_id, coupon_code, user_id);
        return res.status(200).json({
            status: 'success',
            message: 'Áp dụng mã giảm giá thành công',
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi áp dụng mã giảm giá:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Lấy danh sách mã giảm giá hợp lệ cho giỏ hàng hiện tại
const getValidCouponsForCart = async (req, res) => {
    try {
        const user_id = req.user.id || req.user.user_id;

        // Lấy giỏ hàng hiện tại
        const cartService = require('../services/cartService');
        const cart = await cartService.getCart(user_id);

        if (!cart || !cart.total_price || cart.total_price <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Giỏ hàng trống hoặc không có giá trị'
            });
        }

        // Lấy danh sách tất cả mã giảm giá
        const coupons = await couponService.getAllCoupons({ status: 'active' });

        // Lọc các mã giảm giá hợp lệ cho giỏ hàng hiện tại
        const validCoupons = [];
        const now = new Date();

        for (const coupon of coupons) {
            // Kiểm tra thời hạn
            if (now < new Date(coupon.start_date) || now > new Date(coupon.end_date)) {
                continue;
            }

            // Kiểm tra giá trị đơn hàng tối thiểu
            if (coupon.min_order_value && cart.total_price < coupon.min_order_value) {
                continue;
            }

            // Kiểm tra người dùng đã sử dụng mã này chưa
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
                continue;
            }

            // Tính số tiền giảm
            let discount_amount = (cart.total_price * coupon.discount_percent) / 100;

            // Kiểm tra giới hạn giảm giá tối đa
            if (coupon.max_discount_amount && discount_amount > coupon.max_discount_amount) {
                discount_amount = coupon.max_discount_amount;
            }

            validCoupons.push({
                coupon_id: coupon.coupon_id,
                code: coupon.code,
                discount_percent: coupon.discount_percent,
                max_discount_amount: coupon.max_discount_amount,
                min_order_value: coupon.min_order_value,
                discount_amount: discount_amount,
                final_price: cart.total_price - discount_amount
            });
        }

        return res.status(200).json({
            status: 'success',
            message: `Tìm thấy ${validCoupons.length} mã giảm giá hợp lệ`,
            data: {
                cart_total: cart.total_price,
                valid_coupons: validCoupons
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách mã giảm giá hợp lệ:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Lỗi khi lấy danh sách mã giảm giá'
        });
    }
};

module.exports = {
    getAllCoupons,
    getCouponById,
    getCouponByCode,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    getUserCoupons,
    saveCoupon,
    applyCoupon,
    getValidCouponsForCart
};
