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
    console.error("Error creating review:", error);
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByProductId(
      req.params.product_id
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({ message: "Đã xóa đánh giá" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByProductId,
  updateReview,
  deleteReview,
};
