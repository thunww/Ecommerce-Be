const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// router.post("/upload", upload.single("image"), handleUploadProductImage);
// router.get("/:product_id/images", handleGetProductImages);
// router.delete("/image/:image_id", handleDeleteProductImage);

router.get("/", productController.getAllProducts);

// Route tạo sản phẩm mới
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "vendor"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 8 },
    { name: "variations", maxCount: 10 },
  ]),
  productController.createProduct
);

// Route cập nhật sản phẩm
router.put(
  "/:product_id",
  authMiddleware,
  roleMiddleware(["admin", "vendor"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 8 },
    { name: "variations", maxCount: 10 },
  ]),
  productController.updateProduct
);

// Route xóa hình ảnh sản phẩm
router.delete(
  "/image/:image_id",
  authMiddleware,
  roleMiddleware(["admin", "vendor"]),
  productController.deleteProductImage
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
router.get("/related/:related_id", productController.getProductsByCategoryId);

router.get("/search", productController.searchProducts);

router.get("/:product_id", productController.getProductById);

router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-deals", productController.getBestDeals);
router.get("/search/advanced", productController.advancedSearch);
module.exports = router;
