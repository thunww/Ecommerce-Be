const wishlistService = require('../services/wishlistService');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const getWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const wishlist = await wishlistService.getWishlistByUserId(userId);
        return successResponse(res, 'Lấy danh sách yêu thích thành công', wishlist);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        return errorResponse(res, 'Không thể lấy danh sách yêu thích', 500);
    }
};

const addToWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const { product_id } = req.body;

        if (!product_id) {
            return errorResponse(res, 'Thiếu thông tin sản phẩm', 400);
        }

        const result = await wishlistService.addToWishlist(userId, product_id);
        return successResponse(res, 'Thêm vào danh sách yêu thích thành công', result);
    } catch (error) {
        console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
        if (error.message === 'Sản phẩm đã có trong danh sách yêu thích') {
            return errorResponse(res, error.message, 409);
        }
        if (error.message === 'Sản phẩm không tồn tại') {
            return errorResponse(res, error.message, 404);
        }
        return errorResponse(res, 'Đã xảy ra lỗi khi thêm vào danh sách yêu thích', 500);
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const { product_id } = req.params;

        if (!product_id) {
            return errorResponse(res, 'Thiếu thông tin sản phẩm', 400);
        }

        const result = await wishlistService.removeFromWishlist(userId, product_id);
        return successResponse(res, 'Xóa khỏi danh sách yêu thích thành công', result);
    } catch (error) {
        console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
        if (error.message === 'Không tìm thấy sản phẩm trong danh sách yêu thích') {
            return errorResponse(res, error.message, 404);
        }
        return errorResponse(res, 'Đã xảy ra lỗi khi xóa khỏi danh sách yêu thích', 500);
    }
};

const clearWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const result = await wishlistService.clearWishlist(userId);
        return successResponse(res, 'Xóa toàn bộ danh sách yêu thích thành công', result);
    } catch (error) {
        console.error('Lỗi khi xóa toàn bộ danh sách yêu thích:', error);
        return errorResponse(res, 'Đã xảy ra lỗi khi xóa toàn bộ danh sách yêu thích', 500);
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
}; 