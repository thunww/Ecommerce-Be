const cartService = require('../services/cartService');

class CartController {
    addToCart = async (req, res) => {
        try {
            const { product_id, quantity = 1, variant_id } = req.body;
            const user_id = req.user.id || req.user.user_id;

            if (!product_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Thiếu thông tin sản phẩm'
                });
            }

            const cartData = await cartService.addToCart(user_id, product_id, quantity, variant_id);

            return res.status(200).json(cartData);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể thêm vào giỏ hàng'
            });
        }
    };

    getCart = async (req, res) => {
        try {
            const user_id = req.user.id || req.user.user_id;

            // Thêm headers để tránh cache
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            const cartData = await cartService.getCart(user_id);

            return res.status(200).json(cartData);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể lấy thông tin giỏ hàng'
            });
        }
    };

    updateCartItem = async (req, res) => {
        try {
            const cart_item_id = req.params.id;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Số lượng không hợp lệ'
                });
            }

            const cartData = await cartService.updateCartItem(cart_item_id, quantity);

            return res.status(200).json(cartData);
        } catch (error) {
            console.error('Lỗi khi cập nhật giỏ hàng:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể cập nhật giỏ hàng'
            });
        }
    };

    removeFromCart = async (req, res) => {
        try {
            const cart_item_id = req.params.id;
            const cartData = await cartService.removeFromCart(cart_item_id);

            return res.status(200).json(cartData);
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể xóa sản phẩm khỏi giỏ hàng'
            });
        }
    };

    clearCart = async (req, res) => {
        try {
            const user_id = req.user.id || req.user.user_id;
            const cartData = await cartService.clearCart(user_id);

            return res.status(200).json(cartData);
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể xóa giỏ hàng'
            });
        }
    };

    // Áp dụng mã giảm giá vào giỏ hàng
    applyCoupon = async (req, res) => {
        try {
            const { code } = req.body;
            const user_id = req.user.id || req.user.user_id;

            if (!code) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vui lòng nhập mã giảm giá'
                });
            }

            const result = await cartService.applyCoupon(user_id, code);

            // Lưu coupon vào session để sử dụng sau này
            if (req.session) {
                req.session.coupon_code = code;
                req.session.discount = result.discount;
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể áp dụng mã giảm giá'
            });
        }
    };

    // Xóa mã giảm giá khỏi giỏ hàng
    removeCoupon = async (req, res) => {
        try {
            const user_id = req.user.id || req.user.user_id;

            const result = await cartService.removeCoupon(user_id);

            // Xóa coupon khỏi session
            if (req.session) {
                delete req.session.coupon_code;
                delete req.session.discount;
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Lỗi khi xóa mã giảm giá:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể xóa mã giảm giá'
            });
        }
    };

    // Tính phí vận chuyển cho đơn hàng
    calculateShipping = async (req, res) => {
        try {
            const { address } = req.body;
            const user_id = req.user.id || req.user.user_id;

            if (!address) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vui lòng cung cấp thông tin địa chỉ'
                });
            }

            const result = await cartService.calculateShipping(user_id, address);

            // Lưu shipping vào session để sử dụng sau này
            if (req.session) {
                req.session.shipping_fee = result.fee;
                req.session.shipping_address = address;
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Lỗi khi tính phí vận chuyển:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể tính phí vận chuyển'
            });
        }
    };

    // Lấy thông tin tổng hợp giỏ hàng (tổng tiền, giảm giá, phí vận chuyển)
    getCartSummary = async (req, res) => {
        try {
            const user_id = req.user.id || req.user.user_id;

            // Lấy thông tin từ session nếu có
            const sessionData = req.session || {};

            const result = await cartService.getCartSummary(user_id, sessionData);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin tổng hợp giỏ hàng:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Không thể lấy thông tin tổng hợp giỏ hàng'
            });
        }
    };
}

module.exports = new CartController(); 