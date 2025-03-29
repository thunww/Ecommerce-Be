const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  handleUploadProductImage,
  handleGetProductImages,
  handleDeleteProductImage,
} = require("../controllers/productController");
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/upload", upload.single("image"), handleUploadProductImage);
router.get("/:product_id/images", handleGetProductImages);
router.delete("/image/:image_id", handleDeleteProductImage);

// Public routes (không cần xác thực)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.getAllProducts
);

router.put(
  "/assign-product",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.handleAssignProduct
);

router.delete(
  "/:product_id",
  authMiddleware,
  roleMiddleware(["admin", "vendor"]),
  productController.handleDeleteProduct
);

router.get("/search", productController.searchProducts);
router.get("/:product_id", productController.getProductById);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-deals", productController.getBestDeals);
router.get("/:product_id/reviews", reviewController.getReviews);
router.get("/search/advanced", productController.advancedSearch);
module.exports = router;
