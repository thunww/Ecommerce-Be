const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { handleAIChat } = require("../controllers/vendorController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const {
  parseFormAndUpload,
  handleProductError,
} = require("../middleware/checkFileUpload");
const { handleFilterShopProducts } = require("../controllers/vendorController");
const { upload } = require("../middleware/uploadMiddleware");

// Middleware cho vendor routes
const vendorMiddleware = [authMiddleware, roleMiddleware(["vendor"], true)];

// Lấy thông tin shop của vendor
router.get("/my-shop", vendorMiddleware, vendorController.handleGetMyShop);
router.get(
  "/shop/category",
  vendorMiddleware,
  categoryController.getAllCategories
);

// Lấy doanh thu tổng
router.get("/revenue", vendorMiddleware, vendorController.handleGetRevenue);

// Lấy danh sách đơn hàng
router.get("/orders", vendorMiddleware, vendorController.handleGetAllOrders);
// Lấy danh sách đơn hàng với phân trang và filter
router.get(
  "/orders",
  vendorMiddleware,
  vendorController.handleGetOrdersWithFilter
);
// Route lấy danh sách đơn hàng với phân trang
router.get(
  "/ordersPage",
  vendorMiddleware,
  vendorController.handleGetOrdersWithFilter
);

// Route to update status for multiple suborders to 'processing'
router.put(
  "/orders/bulk-status",
  vendorMiddleware,
  vendorController.handleUpdateSubordersStatusToProcessing
);

// Route to delete multiple suborders by their IDs
router.delete(
  "/orders/bulk-delete",
  vendorMiddleware,
  vendorController.handleDeleteSuborders
);

// Route để xuất dữ liệu đơn hàng
router.get(
  "/orders/export",
  vendorMiddleware,
  vendorController.handleExportOrders
);

// Lấy thống kê shop
router.get(
  "/order-stats",
  vendorMiddleware,
  vendorController.handleGetShopAnalytics
);

// Cập nhật thông tin shop
router.put("/shop", vendorMiddleware, vendorController.handleUpdateShop);

// Cập nhật logo shop
router.put(
  "/shop/logo",
  vendorMiddleware,
  vendorController.handleUpdateShopLogo
);

// Cập nhật banner shop
router.put(
  "/shop/banner",
  vendorMiddleware,
  vendorController.handleUpdateShopBanner
);

// Lấy đánh giá shop
router.get(
  "/shop/reviews",
  vendorMiddleware,
  vendorController.handleGetShopReviews
);

// Lấy rating của shop
router.get(
  "/shop/rating",
  vendorMiddleware,
  vendorController.handleGetShopRating
);

// Lấy danh sách sản phẩm của shop
router.get(
  "/shop/products",
  vendorMiddleware,
  vendorController.handleGetShopProducts
);

// AI Chat
router.post(
  "/ai-chat",
  vendorMiddleware,
  (req, res, next) => {
    next();
  },
  handleAIChat
);

// Process sản phẩm
router.post(
  "/products/:product_id/process",
  vendorMiddleware,
  vendorController.handleProcessProduct
);

// New route for paginated suborders with order items
router.get(
  "/suborders",
  vendorMiddleware,
  vendorController.handleGetSubordersWithOrderItemsPaginated
);
// update product of vendor
router.put(
  "/product/update/:product_id/:variant_id",
  vendorMiddleware,
  parseFormAndUpload,
  vendorController.handleUpdateProduct,
  handleProductError
);
// update product variant of vendor
router.put(
  "/product/update/:product_id",
  vendorMiddleware,
  parseFormAndUpload,
  vendorController.handleUpdateProduct,
  handleProductError
);

// Route để xóa một variant của sản phẩm
router.delete(
  "/product/:product_id/variant/:variant_id",
  vendorMiddleware,
  vendorController.handleDeleteVariant
);

// create new product
router.post(
  "/product/create",
  vendorMiddleware,
  parseFormAndUpload,
  vendorController.handleCreateProduct,
  handleProductError
);

module.exports = router;
