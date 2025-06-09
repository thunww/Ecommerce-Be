// BE/src/middlewares/productMiddleware.js
const { uploadProduct } = require("../config/uploadConfig");
const { deleteImagesByUrls } = require("../utils/cloudinaryHelper");

/**
 * Middleware upload ảnh cho các variant (không nhận ảnh product)
 */
const parseFormAndUpload = async (req, res, next) => {
  req.uploadedImages = []; // [{ fieldname, path }]

  try {
    const upload = uploadProduct.any();

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Lỗi upload ảnh",
          error: err.message,
        });
      }

      // Lưu tất cả các file đã upload
      if (req.files) {
        req.files.forEach((file) => {
          req.uploadedImages.push({
            fieldname: file.fieldname,
            path: file.path,
          });
        });
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

/**
 * Middleware xử lý lỗi và xóa ảnh
 */
const handleProductError = async (err, req, res, next) => {
  // Xóa ảnh đã upload nếu có lỗi
  if (req.uploadedImages && req.uploadedImages.length > 0) {
    await deleteImagesByUrls(req.uploadedImages.map((img) => img.path));
    console.log(
      `Đã xóa ${req.uploadedImages.length} ảnh do lỗi: ${err.message}`
    );
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

module.exports = {
  parseFormAndUpload,
  handleProductError,
};
