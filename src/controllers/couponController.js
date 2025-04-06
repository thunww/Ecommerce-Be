const couponService = require('../services/couponService');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponService.getAllCoupons();
        return res.status(200).json(
            successResponse('Lấy danh sách mã giảm giá thành công', coupons)
        );
    } catch (error) {
        console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
        return res.status(500).json(
            errorResponse('Đã xảy ra lỗi khi lấy danh sách mã giảm giá', 500)
        );
    }
};

const getCouponById = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const coupon = await couponService.getCouponById(coupon_id);

        if (!coupon) {
            return res.status(404).json(
                errorResponse('Không tìm thấy mã giảm giá', 404)
            );
        }

        return res.status(200).json(
            successResponse('Lấy thông tin mã giảm giá thành công', coupon)
        );
    } catch (error) {
        console.error('Lỗi khi lấy thông tin mã giảm giá:', error);
        return res.status(500).json(
            errorResponse('Đã xảy ra lỗi khi lấy thông tin mã giảm giá', 500)
        );
    }
};

const createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        const coupon = await couponService.createCoupon(couponData);
        return res.status(201).json(
            successResponse('Tạo mã giảm giá thành công', coupon, 201)
        );
    } catch (error) {
        console.error('Lỗi khi tạo mã giảm giá:', error);
        return res.status(500).json(
            errorResponse('Đã xảy ra lỗi khi tạo mã giảm giá', 500)
        );
    }
};

const updateCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const updateData = req.body;
        const coupon = await couponService.updateCoupon(coupon_id, updateData);

        if (!coupon) {
            return res.status(404).json(
                errorResponse('Không tìm thấy mã giảm giá', 404)
            );
        }

        return res.status(200).json(
            successResponse('Cập nhật mã giảm giá thành công', coupon)
        );
    } catch (error) {
        console.error('Lỗi khi cập nhật mã giảm giá:', error);
        return res.status(500).json(
            errorResponse('Đã xảy ra lỗi khi cập nhật mã giảm giá', 500)
        );
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const result = await couponService.deleteCoupon(coupon_id);

        if (!result) {
            return res.status(404).json(
                errorResponse('Không tìm thấy mã giảm giá', 404)
            );
        }

        return res.status(200).json(
            successResponse('Xóa mã giảm giá thành công')
        );
    } catch (error) {
        console.error('Lỗi khi xóa mã giảm giá:', error);
        return res.status(500).json(
            errorResponse('Đã xảy ra lỗi khi xóa mã giảm giá', 500)
        );
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const { total_amount } = req.body;
        const result = await couponService.validateCoupon(code, total_amount);

        if (!result.valid) {
            return res.status(400).json(
                errorResponse(result.message)
            );
        }

        return res.status(200).json(
            successResponse('Mã giảm giá hợp lệ', result)
        );
    } catch (error) {
        console.error('Lỗi khi kiểm tra mã giảm giá:', error);
        return res.status(500).json(
            errorResponse('Đã xảy ra lỗi khi kiểm tra mã giảm giá', 500)
        );
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