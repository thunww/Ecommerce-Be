const {
  uploadProductImage,
  getProductImages,
  deleteProductImage,
} = require("../services/productImage");
const productService = require("../services/productService");

const handleUploadProductImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please select an image" });

    const newImage = await uploadProductImage(
      req.body.product_id,
      req.file.path, // Cloudinary URL
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

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.product_id);
    if (!result) {
      return res.status(404).json({ result });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q, category_id, min_price, max_price, sort } = req.query;
    const products = await productService.searchProducts(
      q,
      category_id,
      min_price,
      max_price,
      sort
    );
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
    const { keyword, category_id, min_price, max_price, rating, sort } =
      req.query;
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

const handleAssignProduct = async (req, res) => {
  try {
    const { product_id, status } = req.body;
    const result = await productService.assignProduct(product_id, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const handleDeleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await productService.deleteProduct(product_id);

    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Product not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Error in handleDeleteProduct:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
  advancedSearch,
  handleAssignProduct,
  handleDeleteProduct,
};
