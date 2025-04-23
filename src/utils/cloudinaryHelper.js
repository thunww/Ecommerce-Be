// BE/src/utils/cloudinaryHelper.js
const { cloudinary } = require('../config/cloudinary');

/**
 * Xóa một ảnh từ Cloudinary bằng URL đầy đủ
 * @param {string} imageUrl - URL đầy đủ của ảnh trên Cloudinary
 * @returns {Promise<boolean>} - true nếu xóa thành công, false nếu thất bại
 */
const deleteImageByUrl = async (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error(`Không thể xóa ảnh: imageUrl không hợp lệ (${typeof imageUrl}):`, imageUrl);
      return false;
    }
    
    // Trích xuất public_id từ URL Cloudinary đúng cách
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!matches || !matches[1]) {
      console.error(`Không thể trích xuất public_id từ URL: ${imageUrl}`);
      return false;
    }
    
    // Xóa phần extension (.jpg, .png, etc) nếu có
    const publicId = matches[1].replace(/\.(jpg|jpeg|png|gif|webp)$/, '');
    
    console.log(`Đang xóa ảnh với public_id: ${publicId}`);
    
    // Xóa ảnh
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Kết quả xóa ảnh: ${JSON.stringify(result)}`);
    
    return result.result === 'ok';
  } catch (error) {
    console.error(`Lỗi khi xóa ảnh từ Cloudinary:`, error);
    return false;
  }
};

/**
 * Xóa nhiều ảnh từ Cloudinary bằng mảng URL
 * @param {string[]} imageUrls - Mảng các URL đầy đủ của ảnh trên Cloudinary
 * @returns {Promise<number>} - Số lượng ảnh đã xóa thành công
 */
const deleteImagesByUrls = async (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    console.log("Không có ảnh nào để xóa");
    return 0;
  }
  
  console.log(`Chuẩn bị xóa ${imageUrls.length} ảnh:`, imageUrls);
  
  let deletedCount = 0;
  for (const url of imageUrls) {
    const deleted = await deleteImageByUrl(url);
    if (deleted) deletedCount++;
  }
  
  console.log(`Đã xóa ${deletedCount}/${imageUrls.length} ảnh từ Cloudinary`);
  return deletedCount;
};

module.exports = {
  deleteImageByUrl,
  deleteImagesByUrls
};