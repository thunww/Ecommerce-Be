const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { handleAIChat } = require("../controllers/vendorController");
const categoryController = require("../controllers/categoryController");

// Middleware cho vendor routes
const vendorMiddleware = [authMiddleware, roleMiddleware(["vendor"], true)];

// Lấy thông tin shop của vendor
router.get("/my-shop", vendorMiddleware, vendorController.handleGetMyShop);
router.get(
  "/shop/category",
  vendorMiddleware,
  categoryController.getAllCategories
);

// Lấy doanh thu shop
router.get(
  "/shop-revenue",
  vendorMiddleware,
  vendorController.handleGetShopRevenue
);

// Lấy doanh thu tổng
router.get("/revenue", vendorMiddleware, vendorController.handleGetRevenue);

// Lấy danh sách đơn hàng
router.get("/orders", vendorMiddleware, vendorController.handleGetAllOrders);

// Lấy thống kê shop
router.get(
  "/shop-analytics",
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

module.exports = router;
