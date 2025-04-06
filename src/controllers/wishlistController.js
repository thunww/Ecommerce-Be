const wishlistService = require('../services/wishlistService');

const getWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const wishlist = await wishlistService.getWishlistByUserId(userId);

        // Trả về kết quả thành công
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách yêu thích thành công',
            data: wishlist
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);

        // Trả về lỗi
        return res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách yêu thích',
            error: error.message
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin sản phẩm'
            });
        }

        const result = await wishlistService.addToWishlist(userId, product_id);

        // Trả về kết quả thành công
        return res.status(200).json({
            success: true,
            message: 'Thêm vào danh sách yêu thích thành công',
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi thêm vào danh sách yêu thích:', error);

        // Kiểm tra lỗi và trả về thông báo phù hợp
        if (error.message === 'Sản phẩm đã có trong danh sách yêu thích') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === 'Sản phẩm không tồn tại') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        // Trả về lỗi chung
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi thêm vào danh sách yêu thích',
            error: error.message
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const { product_id } = req.params;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin sản phẩm'
            });
        }

        const result = await wishlistService.removeFromWishlist(userId, product_id);

        // Trả về kết quả thành công
        return res.status(200).json({
            success: true,
            message: 'Xóa khỏi danh sách yêu thích thành công',
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);

        // Trả về lỗi nếu sản phẩm không có trong danh sách yêu thích
        if (error.message === 'Không tìm thấy sản phẩm trong danh sách yêu thích') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        // Trả về lỗi chung
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa khỏi danh sách yêu thích',
            error: error.message
        });
    }
};

const clearWishlist = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const userId = req.user.user_id;
        console.log('User ID from token:', userId);
        const result = await wishlistService.clearWishlist(userId);

        // Trả về kết quả thành công
        return res.status(200).json({
            success: true,
            message: 'Xóa toàn bộ danh sách yêu thích thành công',
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi xóa toàn bộ danh sách yêu thích:', error);

        // Trả về lỗi chung
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa toàn bộ danh sách yêu thích',
            error: error.message
        });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
};
