const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllAddressesById,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

// Áp dụng authMiddleware cho tất cả routes
router.use(authMiddleware);

// Lấy tất cả địa chỉ của user
router.get("/", getAllAddressesById);

// Tạo địa chỉ mới
router.post("/", createAddress);

// Lấy một địa chỉ theo address_id
router.get("/:address_id", getAddressById);

// Cập nhật địa chỉ
router.put("/:address_id", updateAddress);

// Xóa địa chỉ
router.delete("/:address_id", deleteAddress);

// Đặt địa chỉ làm mặc định
router.patch("/:address_id/default", setDefaultAddress);

module.exports = router;
