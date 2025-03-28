const wishlistService = require('../services/wishlistService');

exports.addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;
        const wishlistItem = await wishlistService.addToWishlist(req.user.user_id, product_id);
        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.getWishlist(req.user.user_id);
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        await wishlistService.removeFromWishlist(req.params.id);
        res.json({ message: 'Đã xóa sản phẩm khỏi danh sách yêu thích' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 