const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const cartItem = await cartService.addToCart(req.user.user_id, product_id, quantity);
        res.status(201).json({
            success: true,
            message: 'Thêm vào giỏ hàng thành công',
            data: cartItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.user_id);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartService.updateCartItem(req.params.id, quantity);
        res.status(200).json({
            success: true,
            message: 'Cập nhật giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await cartService.removeFromCart(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 