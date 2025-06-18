const { ProductReview, Product, User } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

class ReviewService {
  async createReview(user_id, product_id, rating, comment, images) {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(product_id);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // TODO: Kiểm tra người dùng đã mua sản phẩm chưa

    // Tạo đánh giá mới
    const review = await ProductReview.create({
      user_id,
      product_id,
      rating,
      comment,
      images: images || "",
    });

    // Cập nhật điểm đánh giá trung bình của sản phẩm
    await this.updateProductAverageRating(product_id);

    // Lấy thông tin chi tiết của đánh giá vừa tạo
    const detailedReview = await ProductReview.findByPk(review.review_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "profile_picture"],
        },
      ],
    });

    // Trả về response chuẩn
    return {
      success: true,
      message: "Tạo đánh giá thành công",
      data: detailedReview,
    };
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
    try {
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

      const updatedReview = await ProductReview.findByPk(review_id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "username", "profile_picture"],
          },
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "average_rating"],
          },
        ],
      });

      return {
        success: true,
        message: "Cập nhật đánh giá thành công",
        data: updatedReview,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi cập nhật đánh giá",
        data: null,
      };
    }
  }

  async updateReviewStatus(review_id, is_verified) {
    try {
      const review = await ProductReview.findByPk(review_id);
      if (!review) {
        throw new Error("Không tìm thấy đánh giá");
      }

      review.is_verified = is_verified;
      await review.save();

      const updatedReview = await ProductReview.findByPk(review_id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "username", "profile_picture"],
          },
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "average_rating"],
          },
        ],
      });

      return {
        success: true,
        message: "Cập nhật trạng thái xác minh thành công",
        data: updatedReview,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái xác minh:", error);
      return {
        success: false,
        message:
          error.message || "Đã xảy ra lỗi khi cập nhật trạng thái xác minh",
        data: null,
      };
    }
  }

  async deleteReview(review_id) {
    try {
      const review = await ProductReview.findByPk(review_id);
      if (!review) {
        throw new Error("Không tìm thấy đánh giá");
      }

      const product_id = review.product_id;
      await review.destroy();

      // Cập nhật điểm đánh giá trung bình của sản phẩm
      await this.updateProductAverageRating(product_id);

      return {
        success: true,
        message: "Xóa đánh giá thành công",
        data: null,
      };
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi xóa đánh giá",
        data: null,
      };
    }
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
      { average_rating: parseFloat(averageRating).toFixed(2) },
      { where: { product_id } }
    );
  }

  async getReviewById(review_id) {
    try {
      const review = await ProductReview.findByPk(review_id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "username", "profile_picture"],
          },
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "average_rating"],
          },
        ],
      });

      if (!review) {
        return {
          success: false,
          message: "Không tìm thấy đánh giá",
          data: null,
        };
      }

      return {
        success: true,
        message: "Lấy đánh giá thành công",
        data: review,
      };
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá theo ID:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy đánh giá",
        data: null,
      };
    }
  }

  async getReviewsByUser(user_id) {
    try {
      const reviews = await ProductReview.findAll({
        where: { user_id },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "average_rating"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        message: "Lấy danh sách đánh giá của người dùng thành công",
        data: reviews,
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá của người dùng:", error);
      return {
        success: false,
        message: "Lỗi khi lấy đánh giá",
        data: null,
      };
    }
  }

  async getAllReviews() {
    try {
      const reviews = await ProductReview.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "username", "profile_picture"],
          },
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "average_rating"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        message: "Lấy tất cả đánh giá thành công",
        data: reviews,
      };
    } catch (error) {
      console.error("Lỗi khi lấy tất cả đánh giá:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy dữ liệu",
        data: null,
      };
    }
  }
}

module.exports = new ReviewService();
