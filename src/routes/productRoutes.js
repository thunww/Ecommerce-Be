const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadProduct } = require("../config/cloudinary");
const { parseFormAndUpload, handleProductError } = require('../middleware/checkFileUpload');

router.get("/", productController.getAllProducts);

router.post('/create',
  authMiddleware,
  roleMiddleware(["vendor"]),
  parseFormAndUpload, // Upload ảnh & parse form data
  productController.createProduct, // Controller kiểm tra tên + tạo sản phẩm
  handleProductError // Xử lý lỗi và xóa ảnh
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
router.get("/suggest", productController.suggestProducts);

router.get("/:product_id", productController.getProductById);

router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-deals", productController.getBestDeals);
router.get("/search/advanced", productController.advancedSearch);
module.exports = router;
