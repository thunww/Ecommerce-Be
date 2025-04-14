const productService = require("../services/productService");

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
    // Destructure query parameters with defaults
    const {
      q = "",
      category_id,
      min_price = 0,
      max_price = Number.MAX_SAFE_INTEGER,
      sort = "default",
    } = req.query;

    // Input validation
    if (min_price < 0 || max_price < 0) {
      return res.status(400).json({
        success: false,
        message: "Prices cannot be negative",
      });
    }
    if (min_price > max_price) {
      return res.status(400).json({
        success: false,
        message: "min_price cannot be greater than max_price",
      });
    }
    if (category_id && !Number.isInteger(Number(category_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid category_id",
      });
    }

    // Call product service
    const result = await productService.searchProducts(
      q.trim(),
      category_id ? Number(category_id) : undefined,
      Number(min_price),
      Number(max_price),
      sort
    );

    // Return response
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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

const getProductsByCategoryId = async (req, res) => {
  try {
    const { related_id } = req.params;
    const result = await productService.getProductsByCategoryId(related_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestDeals,
  advancedSearch,
  handleAssignProduct,
  handleDeleteProduct,
  getProductsByCategoryId,
};
