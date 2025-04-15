const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Xác định thư mục lưu trữ dựa trên loại tài nguyên
    let folder = "products"; // Mặc định là sản phẩm

    if (req.url.includes("avatar") || req.url.includes("user")) {
      folder = "avatars";
    } else if (req.url.includes("shop")) {
      folder = "shops";
    } else {
      // Phân loại các hình ảnh sản phẩm
      if (file.fieldname === "image") {
        folder = "products/main";
      } else if (file.fieldname === "images") {
        folder = "products/additional";
      } else if (file.fieldname === "variations") {
        folder = "products/variations";
      }
    }

    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
      // Thêm tham số public_id để đảm bảo không trùng tên file
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Giới hạn kích thước file là 5MB
const fileFilter = (req, file, cb) => {
  // Kiểm tra định dạng file
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép tải lên hình ảnh!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
