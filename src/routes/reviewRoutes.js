// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

router.get("/:product_id", reviewController.getReviewsByProductId);

// Nếu cần đăng nhập để thao tác:
router.use(authMiddleware);
////router.post("/products/:id/reviews", reviewController.createReview);
//router.put("/reviews/:id", reviewController.updateReview);
//router.delete("/reviews/:id", reviewController.deleteReview);

module.exports = router;
