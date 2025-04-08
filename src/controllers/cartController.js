const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity = 1, variant_id } = req.body;
        const user_id = req.user.id || req.user.user_id;

        if (!product_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Thiếu thông tin sản phẩm'
            });
        }

        const cart = await cartService.addToCart(user_id, product_id, quantity, variant_id);

        return res.status(200).json({
            status: 'success',
            message: 'Thêm vào giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Không thể thêm vào giỏ hàng'
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.id || req.user.user_id;

        // Thêm headers để tránh cache
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const cart = await cartService.getCart(user_id);

        return res.status(200).json({
            status: 'success',
            data: cart
        });
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Không thể lấy thông tin giỏ hàng'
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const cart_item_id = req.params.id;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Số lượng không hợp lệ'
            });
        }

        const cart = await cartService.updateCartItem(cart_item_id, quantity);

        return res.status(200).json({
            status: 'success',
            message: 'Cập nhật giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Không thể cập nhật giỏ hàng'
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart_item_id = req.params.id;
        const cart = await cartService.removeFromCart(cart_item_id);

        return res.status(200).json({
            status: 'success',
            message: 'Đã xóa sản phẩm khỏi giỏ hàng',
            data: cart
        });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Không thể xóa sản phẩm khỏi giỏ hàng'
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const user_id = req.user.id || req.user.user_id;
        const cart = await cartService.clearCart(user_id);

        return res.status(200).json({
            status: 'success',
            message: 'Đã xóa tất cả sản phẩm trong giỏ hàng',
            data: cart
        });
    } catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Không thể xóa giỏ hàng'
        });
    }
}; 