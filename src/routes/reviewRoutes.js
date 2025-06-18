const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");
const upload = require("../middleware/uploadMiddleware");

// Lấy đánh giá theo ID (công khai)
router.get("/by-id/:id", reviewController.getReviewById);

// Lấy danh sách đánh giá theo sản phẩm (công khai)
router.get("/:product_id", reviewController.getReviewsByProductId);

// Áp dụng authMiddleware cho các route yêu cầu đăng nhập
router.use(authMiddleware);

// Lấy tất cả đánh giá (dành cho admin)
router.get("/admin/all", reviewController.getAllReviews);

// Lấy đánh giá của người dùng hiện tại
router.get("/user/all", reviewController.getReviewsByUser);

// Tạo đánh giá mới cho sản phẩm
router.post(
  "/products/:id",
  upload.single("image"),
  reviewController.createReview
);

// Cập nhật nội dung đánh giá (rating, comment, images)
router.put("/:id", reviewController.updateReview);

// Cập nhật trạng thái xác minh của đánh giá (is_verified, dành cho admin)
router.put("/:id/status", reviewController.updateReviewStatus);

// Xóa đánh giá
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
