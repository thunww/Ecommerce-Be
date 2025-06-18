const reviewService = require("../services/reviewService");

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product_id = req.params.id;

    const images = req.file
      ? req.file.secure_url || req.file.url || req.file.path
      : null;

    const review = await reviewService.createReview(
      req.user.user_id,
      product_id,
      rating,
      comment,
      images
    );
    res.status(201).json(review);
  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Không thể tạo đánh giá",
      data: null,
    });
  }
};

const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByProductId(
      req.params.product_id
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá theo sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Không thể lấy đánh giá",
      data: null,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const review = await reviewService.updateReview(
      req.params.id,
      rating,
      comment,
      images
    );
    res.status(200).json(review);
  } catch (error) {
    console.error("Lỗi khi cập nhật đánh giá:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Không thể cập nhật đánh giá",
      data: null,
    });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { is_verified } = req.body;
    const review_id = req.params.id;

    if (typeof is_verified !== "boolean") {
      throw new Error("Trạng thái xác minh phải là boolean");
    }

    const review = await reviewService.updateReviewStatus(
      review_id,
      is_verified
    );
    res.status(200).json(review);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái xác minh:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Không thể cập nhật trạng thái xác minh",
      data: null,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const response = await reviewService.deleteReview(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi khi xóa đánh giá:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Không thể xóa đánh giá",
      data: null,
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    res.status(200).json(review);
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá theo ID:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Không thể lấy đánh giá",
      data: null,
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const response = await reviewService.getAllReviews();
    res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đánh giá:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Không thể lấy tất cả đánh giá",
      data: null,
    });
  }
};

const getReviewsByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const response = await reviewService.getReviewsByUser(user_id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá của người dùng:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Không thể lấy đánh giá của người dùng",
      data: null,
    });
  }
};

module.exports = {
  createReview,
  getReviewsByProductId,
  updateReview,
  updateReviewStatus,
  deleteReview,
  getReviewById,
  getAllReviews,
  getReviewsByUser,
};
