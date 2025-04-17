const { ProductReview, Product, User } = require("../models");
const { Op } = require("sequelize");

class ReviewService {
  async createReview(user_id, product_id, rating, comment, images) {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(product_id);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Kiểm tra người dùng đã mua sản phẩm chưa
    // TODO: Implement check if user has purchased the product

    // Tạo đánh giá mới
    const review = await ProductReview.create({
      user_id,
      product_id,
      rating,
      comment,
      images: images || [],
    });

    // Cập nhật điểm đánh giá trung bình của sản phẩm
    await this.updateProductAverageRating(product_id);

    // Lấy thông tin chi tiết của đánh giá
    return await ProductReview.findByPk(review.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "avatar"],
        },
      ],
    });
  }

  async getReviewsByProductId(product_id) {
    try {
      const reviews = await ProductReview.findAll({
        where: { product_id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "username", "profile_picture"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      if (!reviews || reviews.length === 0) {
        return {
          success: false,
          message: "Không có đánh giá nào cho sản phẩm này",
          data: [],
        };
      }

      return {
        success: true,
        message: "Lấy danh sách đánh giá thành công",
        data: reviews,
      };
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy đánh giá sản phẩm",
        data: null,
      };
    }
  }

  async updateReview(review_id, rating, comment, images) {
    const review = await ProductReview.findByPk(review_id);
    if (!review) {
      throw new Error("Không tìm thấy đánh giá");
    }

    review.rating = rating;
    review.comment = comment;
    if (images) {
      review.images = images;
    }
    await review.save();

    // Cập nhật điểm đánh giá trung bình của sản phẩm
    await this.updateProductAverageRating(review.product_id);

    return await ProductReview.findByPk(review_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "avatar"],
        },
      ],
    });
  }

  async deleteReview(review_id) {
    const review = await ProductReview.findByPk(review_id);
    if (!review) {
      throw new Error("Không tìm thấy đánh giá");
    }

    const product_id = review.product_id;
    await review.destroy();

    // Cập nhật điểm đánh giá trung bình của sản phẩm
    await this.updateProductAverageRating(product_id);
  }

  async updateProductAverageRating(product_id) {
    const reviews = await ProductReview.findAll({
      where: { product_id },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
      ],
    });

    const averageRating = reviews[0].getDataValue("average_rating") || 0;

    await Product.update(
      { average_rating: averageRating },
      { where: { id: product_id } }
    );
  }
}

module.exports = new ReviewService();
