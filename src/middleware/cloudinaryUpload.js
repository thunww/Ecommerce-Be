const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Giới hạn kiểu file và kích thước
const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận các định dạng hình ảnh phổ biến
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file hình ảnh (jpeg, png, gif, webp)"), false);
  }
};

// Cấu hình storage cho sản phẩm
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DONG/products",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Cấu hình storage cho biến thể sản phẩm
const variantStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DONG/variants",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// Khởi tạo middleware multer cho sản phẩm
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB cho mỗi file
  },
});

// Khởi tạo middleware multer cho biến thể
const uploadVariant = multer({
  storage: variantStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // Giới hạn 3MB cho mỗi file
  },
});

module.exports = {
  uploadProduct,
  uploadVariant,
};
