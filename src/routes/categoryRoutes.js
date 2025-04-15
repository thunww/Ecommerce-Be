const express = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();
// Lấy tất cả danh mục
router.get("/", categoryController.getAllCategories);

// Lấy danh mục theo ID
router.get("/:id", categoryController.getCategoryById);

// Tạo mới danh mục
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.createCategory
);

// Cập nhật danh mục
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.updateCategory
);

// Xóa danh mục
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.deleteCategory
);

module.exports = router;
