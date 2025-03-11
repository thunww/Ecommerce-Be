const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products", // Thư mục lưu ảnh trên Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"], // Định dạng ảnh cho phép
        transformation: [{ width: 500, height: 500, crop: "limit" }] // Resize ảnh
    }
});

// Middleware upload ảnh
const upload = multer({ storage });

module.exports = upload;
