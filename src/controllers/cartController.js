const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const cartItem = await cartService.addToCart(req.user.user_id, product_id, quantity);
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.user_id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await cartService.updateCartItem(req.params.id, quantity);
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        await cartService.removeFromCart(req.params.id);
        res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 