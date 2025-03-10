//Quản lí sản phẩm, hình ảnh

const {uploadProductImage, getProductImages , deleteProductImage } = require("../services/productImage");

const handleUploadProductImage = async (req, res) => {
    try {
        console.log("Body nhận được:", req.body);
        if (!req.file) return res.status(400).json({ message: "Vui lòng chọn ảnh" });

        const newImage = await uploadProductImage(
            req.body.product_id,
            req.file.path,  // URL Cloudinary
            req.body.is_primary
        );

        res.json({ message: "Upload thành công!", image: newImage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const handleGetProductImages = async (req, res) => {
    try {
        const images = await getProductImages(req.params.product_id);
        res.json({ images });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const handleDeleteProductImage = async (req, res) => {
    try {
        const message = await deleteProductImage(req.params.image_id);
        res.json({ message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleUploadProductImage,
    handleGetProductImages,
    handleDeleteProductImage
};