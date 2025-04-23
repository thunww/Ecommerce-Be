// BE/src/middlewares/productMiddleware.js
const { uploadProduct } = require('../config/cloudinary');
const { deleteImagesByUrls } = require('../utils/cloudinaryHelper');

/**
 * Middleware upload ảnh và parse form-data
 */
const parseFormAndUpload = async (req, res, next) => {
  req.uploadedImages = []; // Khởi tạo mảng chứa đường dẫn ảnh

  try {
    // Cấu hình upload - parse cả text fields và file
    const upload = uploadProduct.fields([
      { name: 'primaryImage', maxCount: 1 },
      { name: 'additionalImages', maxCount: 10 }
    ]);

    // Thực hiện upload
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Lỗi upload ảnh",
          error: err.message
        });
      }

      // Lưu lại URLs của ảnh đã upload
      if (req.files) {
        if (req.files.primaryImage && req.files.primaryImage[0]) {
          req.uploadedImages.push(req.files.primaryImage[0].path);
        }
        if (req.files.additionalImages) {
          req.files.additionalImages.forEach(file => {
            req.uploadedImages.push(file.path);
          });
        }
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

/**
 * Middleware xử lý lỗi và xóa ảnh
 */
const handleProductError = async (err, req, res, next) => {
  // Xóa ảnh đã upload nếu có lỗi
  if (req.uploadedImages && req.uploadedImages.length > 0) {
    await deleteImagesByUrls(req.uploadedImages);
    console.log(`Đã xóa ${req.uploadedImages.length} ảnh do lỗi: ${err.message}`);
  }
  
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message
  });
};

module.exports = {
  parseFormAndUpload,
  handleProductError
};