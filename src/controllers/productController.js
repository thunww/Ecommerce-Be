const { uploadProductImage, getProductImages, deleteProductImage } = require("../services/productImage");
const productService = require('../services/productService');

const handleUploadProductImage = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "Please select an image" });

        const newImage = await uploadProductImage(
            req.body.product_id,
            req.file.path,  // Cloudinary URL
            req.body.is_primary
        );

        res.json({ message: "Upload successful!", image: newImage });
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

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.product_id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { q, category_id, min_price, max_price, sort } = req.query;
        const products = await productService.searchProducts(q, category_id, min_price, max_price, sort);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await productService.getFeaturedProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNewArrivals = async (req, res) => {
    try {
        const products = await productService.getNewArrivals();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBestDeals = async (req, res) => {
    try {
        const products = await productService.getBestDeals();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const advancedSearch = async (req, res) => {
    try {
        const { keyword, category_id, min_price, max_price, rating, sort } = req.query;
        const products = await productService.advancedSearch(
            keyword,
            category_id,
            min_price,
            max_price,
            rating,
            sort
        );
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleUploadProductImage,
    handleGetProductImages,
    handleDeleteProductImage,
    getAllProducts,
    getProductById,
    searchProducts,
    getFeaturedProducts,
    getNewArrivals,
    getBestDeals,
    advancedSearch
};
