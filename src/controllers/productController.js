const productService = require("../services/productService");
const { Shop } = require("../models");
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// ham tao san pham
const createProduct = async (req, res) => {
  try {
    // Lấy thông tin người dùng từ token
    const userId = req.user.user_id;

    // Lấy thông tin từ request body với đúng tên trường từ frontend
    const {
      productName,
      category,
      description,
      price,
      stock,
      images,
      variations,
      weight,
      parcelSize,
      shippingOptions,
      preOrder,
      condition,
      parentSKU,
      promotionImage,
    } = req.body;

    // Lấy shop_id từ user đã xác thực
    const shop = await Shop.findOne({ where: { owner_id: userId } });
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy thông tin shop",
      });
    }

    // Kiểm tra các trường bắt buộc
    if (!productName || !category || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // Gọi service để tạo sản phẩm
    const result = await productService.createProduct({
      productName,
      description,
      price,
      stock,
      category_id: category, // Đổi tên trường để phù hợp với model
      shop_id: shop.shop_id,
      images,
      variations,
      weight,
      dimensions: JSON.stringify(parcelSize) || null, // Đổi tên trường
      status: "active", // Trạng thái khi nhấn Save and Public
      promotionImage,
      preOrder,
      condition,
      parentSKU,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const deleteProductImage = async (req, res) => {
  try {
    const { image_id } = req.params;
    const userId = req.user.id;

    const result = await productService.deleteProductImage(image_id, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    // console.error("Error deleting product image:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa hình ảnh sản phẩm",
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
  deleteProductImage,
  createProduct, // Thêm hàm mới
};
