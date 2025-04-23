const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder = req.url.includes("avatar") ? "avatars" : "products";
    return {
      folder: folder, // Use avatars or products based on the condition
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

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

// Khởi tạo middleware multer với cấu hình
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB cho mỗi file
  },
});

module.exports = upload;
