const reviewService = require('../services/reviewService');

exports.createReview = async (req, res) => {
    try {
        const { product_id, rating, comment, images } = req.body;
        const review = await reviewService.createReview(req.user.user_id, product_id, rating, comment, images);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getReviews(req.params.product_id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment, images } = req.body;
        const review = await reviewService.updateReview(req.params.id, rating, comment, images);
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await reviewService.deleteReview(req.params.id);
        res.json({ message: 'Đã xóa đánh giá' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 