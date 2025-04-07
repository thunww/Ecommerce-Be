const reviewService = require('../services/reviewService');

class ReviewController {
    async createReview(req, res) {
        try {
            const { product_id, rating, title, comment } = req.body;
            const user_id = req.user.id;

            if (!product_id || !rating) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vui lòng cung cấp đầy đủ thông tin!'
                });
            }

            const review = await reviewService.createReview(user_id, product_id, rating, title, comment);

            // Tạm thời bỏ qua phần xử lý ảnh
            // if (req.body.images && Array.isArray(req.body.images)) {
            //     await reviewService.addReviewImages(review.id, req.body.images);
            // }

            return res.status(201).json({
                status: 'success',
                message: 'Đánh giá đã được tạo thành công',
                data: review
            });
        } catch (error) {
            console.error('Lỗi khi tạo đánh giá:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Đã xảy ra lỗi khi tạo đánh giá'
            });
        }
    }

    async getReviews(req, res) {
        try {
            const { product_id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            if (!product_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vui lòng cung cấp ID sản phẩm'
                });
            }

            const reviews = await reviewService.getReviews(product_id, page, limit);

            return res.status(200).json({
                status: 'success',
                data: reviews.data,
                pagination: reviews.pagination
            });
        } catch (error) {
            console.error('Lỗi khi lấy đánh giá:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Đã xảy ra lỗi khi lấy đánh giá'
            });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const { rating, title, comment } = req.body;

            if (!id || !rating) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vui lòng cung cấp đầy đủ thông tin!'
                });
            }

            const review = await reviewService.updateReview(id, rating, title, comment);

            // Tạm thời bỏ qua phần xử lý ảnh
            // if (req.body.images && Array.isArray(req.body.images)) {
            //     await reviewService.addReviewImages(id, req.body.images);
            // }

            return res.status(200).json({
                status: 'success',
                message: 'Đánh giá đã được cập nhật thành công',
                data: review
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật đánh giá:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Đã xảy ra lỗi khi cập nhật đánh giá'
            });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vui lòng cung cấp ID đánh giá!'
                });
            }

            await reviewService.deleteReview(id);

            return res.status(200).json({
                status: 'success',
                message: 'Đánh giá đã được xóa thành công'
            });
        } catch (error) {
            console.error('Lỗi khi xóa đánh giá:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Đã xảy ra lỗi khi xóa đánh giá'
            });
        }
    }
}

module.exports = new ReviewController(); 