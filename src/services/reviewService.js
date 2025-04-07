const { ProductReview, Product, User, sequelize } = require('../models');

class ReviewService {
    async createReview(user_id, product_id, rating, title, content) {
        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findByPk(product_id);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        // Kiểm tra người dùng đã mua sản phẩm chưa
        // TODO: Implement check if user has purchased the product

        // Tạo đánh giá mới - chỉ định các cột có trong DB
        const review = await ProductReview.create({
            user_id,
            product_id,
            rating,

            comment: content || '',

        });

        // Cập nhật điểm đánh giá trung bình của sản phẩm
        await this.updateProductAverageRating(product_id);

        // Lấy thông tin chi tiết của đánh giá - chỉ định cụ thể các cột
        return await ProductReview.findByPk(review.id, {
            attributes: ['review_id', 'user_id', 'product_id', 'rating', 'comment', 'created_at', 'updated_at'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'avatar']
                }
            ]
        });
    }

    // Hàm này sẽ tạm thời được bỏ qua
    async addReviewImages(review_id, imageUrls) {
        // Tạm thời không xử lý images
        console.log('Chức năng thêm ảnh đang bị tắt tạm thời');
        return;
    }

    async getReviews(product_id, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await ProductReview.findAndCountAll({
            attributes: ['review_id', 'user_id', 'product_id', 'rating', 'comment', 'created_at', 'updated_at'],
            where: {
                product_id
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'username', 'profile_picture']
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        return {
            data: rows,
            pagination: {
                total_items: count,
                total_pages: Math.ceil(count / limit),
                current_page: page,
                limit
            }
        };
    }

    async updateReview(review_id, rating, title, content) {
        const review = await ProductReview.findByPk(review_id, {
            attributes: ['review_id', 'user_id', 'product_id', 'rating', 'comment', 'title', 'is_verified', 'created_at', 'updated_at']
        });

        if (!review) {
            throw new Error('Không tìm thấy đánh giá');
        }

        review.rating = rating;
        review.title = title || '';
        review.comment = content || '';
        await review.save();

        // Cập nhật điểm đánh giá trung bình của sản phẩm
        await this.updateProductAverageRating(review.product_id);

        return await ProductReview.findByPk(review_id, {
            attributes: ['review_id', 'user_id', 'product_id', 'rating', 'comment', 'title', 'is_verified', 'created_at', 'updated_at'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'avatar']
                }
            ]
        });
    }

    async deleteReview(review_id) {
        const review = await ProductReview.findByPk(review_id, {
            attributes: ['review_id', 'user_id', 'product_id']
        });

        if (!review) {
            throw new Error('Không tìm thấy đánh giá');
        }

        const product_id = review.product_id;
        await review.destroy();

        // Cập nhật điểm đánh giá trung bình của sản phẩm
        await this.updateProductAverageRating(product_id);
    }

    async updateProductAverageRating(product_id) {
        const result = await ProductReview.findAll({
            where: {
                product_id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('review_id')), 'reviews_count']
            ],
            raw: true
        });

        const averageRating = result[0].average_rating || 0;
        const reviewsCount = result[0].reviews_count || 0;

        await Product.update(
            {
                average_rating: averageRating,
                reviews_count: reviewsCount
            },
            { where: { product_id } }
        );
    }
}

module.exports = new ReviewService(); 