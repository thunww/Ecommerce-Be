const ProductImage = require("../models/productimage");

const uploadProductImage = async (product_id, imageUrl, is_primary) => {
  return await ProductImage.create({
    product_id,
    image_url: imageUrl,
    is_primary: is_primary || false,
  });
};

const getProductImages = async (product_id) => {
  return await ProductImage.findAll({ where: { product_id } });
};

const deleteProductImage = async (image_id) => {
  const image = await ProductImage.findByPk(image_id);
  if (!image) throw new Error("Image does not exist!");
  await image.destroy();
  return "Image deleted successfully!";
};

module.exports = {
  uploadProductImage,
  getProductImages,
  deleteProductImage,
};
