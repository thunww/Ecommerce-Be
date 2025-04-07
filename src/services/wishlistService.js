const { Wishlist, Product } = require('../models');
const { Op } = require('sequelize');

const getWishlistByUserId = async (userId) => {
    try {
        const wishlist = await Wishlist.findAll({
            where: { user_id: userId },
            attributes: ['wishlist_id', 'user_id', 'product_id', 'added_at'],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['product_id', 'product_name', 'price', 'description']
            }]
        });
        return wishlist;
    } catch (error) {
        console.error('Lỗi trong getWishlistByUserId:', error);
        throw new Error('Không thể lấy danh sách yêu thích');
    }
};

const addToWishlist = async (userId, productId) => {
    try {
        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        // Kiểm tra sản phẩm đã có trong wishlist chưa
        const existingItem = await Wishlist.findOne({
            where: {
                user_id: userId,
                product_id: productId
            },
            attributes: ['wishlist_id', 'user_id', 'product_id', 'added_at']
        });

        if (existingItem) {
            throw new Error('Sản phẩm đã có trong danh sách yêu thích');
        }

        // Thêm vào wishlist
        const wishlistItem = await Wishlist.create({
            user_id: userId,
            product_id: productId,
            added_at: new Date()
        }, {
            fields: ['user_id', 'product_id', 'added_at'], // Chỉ định rõ các trường cần insert
            timestamps: false // Tắt timestamps tự động
        });

        // Lấy thông tin chi tiết sau khi tạo
        const result = await Wishlist.findOne({
            where: { wishlist_id: wishlistItem.wishlist_id },
            attributes: ['wishlist_id', 'user_id', 'product_id', 'added_at'],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['product_id', 'product_name', 'price', 'description']
            }]
        });

        return result;
    } catch (error) {
        console.error('Lỗi trong addToWishlist:', error);
        throw error;
    }
};

const removeFromWishlist = async (userId, productId) => {
    try {
        const result = await Wishlist.destroy({
            where: {
                user_id: userId,
                product_id: productId
            }
        });

        if (!result) {
            throw new Error('Không tìm thấy sản phẩm trong danh sách yêu thích');
        }

        return { message: 'Đã xóa sản phẩm khỏi danh sách yêu thích' };
    } catch (error) {
        console.error('Lỗi trong removeFromWishlist:', error);
        throw error;
    }
};

const clearWishlist = async (userId) => {
    try {
        const result = await Wishlist.destroy({
            where: { user_id: userId }
        });

        return { message: 'Đã xóa toàn bộ danh sách yêu thích' };
    } catch (error) {
        console.error('Lỗi trong clearWishlist:', error);
        throw error;
    }
};

module.exports = {
    getWishlistByUserId,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
}; 