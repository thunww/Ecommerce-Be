const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("./cloudinary");

// Cấu hình storage cho sản phẩm - lưu vào thư mục DONG
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DONG",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Cấu hình storage cho biến thể sản phẩm - lưu vào thư mục DONG
const variantStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DONG",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// Cấu hình multer cho upload ảnh sản phẩm
const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Cấu hình multer cho upload ảnh biến thể
const uploadVariant = multer({
  storage: variantStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

module.exports = { uploadProduct, uploadVariant };
