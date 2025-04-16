const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục lưu trữ nếu chưa tồn tại
const createUploadDirs = () => {
  const dirs = [
    "./uploads",
    "./uploads/products",
    "./uploads/products/variants",
    "./uploads/products/thumbnails",
    "./uploads/profiles",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Xác định thư mục lưu trữ dựa trên loại file
    let uploadPath = "./uploads/products";

    if (file.fieldname === "variationImages") {
      uploadPath = "./uploads/products/variants";
    } else if (file.fieldname === "profile") {
      uploadPath = "./uploads/profiles";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất để tránh trùng lặp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
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
