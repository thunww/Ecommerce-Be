const couponService = require('../services/couponService');

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponService.getAllCoupons();
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

        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: 'Không tìm thấy mã giảm giá'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Lấy thông tin mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin mã giảm giá:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi lấy thông tin mã giảm giá'
        });
    }
};

const createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        const coupon = await couponService.createCoupon(couponData);
        return res.status(201).json({
            status: 'success',
            message: 'Tạo mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi tạo mã giảm giá:', error);
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
        const coupon = await couponService.updateCoupon(coupon_id, updateData);

        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: 'Không tìm thấy mã giảm giá'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Cập nhật mã giảm giá thành công',
            data: coupon
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật mã giảm giá:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi cập nhật mã giảm giá'
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const result = await couponService.deleteCoupon(coupon_id);

        if (!result) {
            return res.status(404).json({
                status: 'error',
                message: 'Không tìm thấy mã giảm giá'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Xóa mã giảm giá thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa mã giảm giá:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi xóa mã giảm giá'
        });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const { total_amount } = req.body;
        const result = await couponService.validateCoupon(code, total_amount);

        if (!result.valid) {
            return res.status(400).json({
                status: 'error',
                message: result.message
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Mã giảm giá hợp lệ',
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra mã giảm giá:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi kiểm tra mã giảm giá'
        });
    }
};

module.exports = {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};
