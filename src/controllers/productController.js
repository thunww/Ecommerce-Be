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

const createProduct = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

    const productData = { ...req.body };

    // Xử lý biến thể nếu được gửi dưới dạng chuỗi JSON
    if (req.body.variations && typeof req.body.variations === "string") {
      try {
        productData.variations = JSON.parse(req.body.variations);
      } catch (error) {
        console.error("Error parsing variations:", error);
        return res.status(400).json({
          success: false,
          message: "Định dạng biến thể không hợp lệ",
        });
      }
    }

    // Xử lý files được upload
    if (req.files) {
      // Xử lý ảnh chính
      if (req.files.image && req.files.image.length > 0) {
        productData.image_url = req.files.image[0].path;
      }

      // Xử lý ảnh phụ
      if (req.files.images && req.files.images.length > 0) {
        productData.additional_images = req.files.images.map(
          (file) => file.path
        );
      }

      // Xử lý ảnh cho biến thể
      if (req.files.variations && req.files.variations.length > 0) {
        productData.variation_images = req.files.variations.map(
          (file) => file.path
        );
      }
    }

    console.log("Product data being created:", productData);

    const userId = req.user.id;
    const result = await productService.createProduct(productData, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo sản phẩm",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("Files received for update:", req.files);
    console.log("Body received for update:", req.body);

    const { product_id } = req.params;
    const productData = { ...req.body };

    // Xử lý biến thể nếu được gửi dưới dạng chuỗi JSON
    if (req.body.variations && typeof req.body.variations === "string") {
      try {
        productData.variations = JSON.parse(req.body.variations);
      } catch (error) {
        console.error("Error parsing variations:", error);
        return res.status(400).json({
          success: false,
          message: "Định dạng biến thể không hợp lệ",
        });
      }
    }

    // Xử lý files được upload
    if (req.files) {
      // Xử lý ảnh chính nếu có cập nhật
      if (req.files.image && req.files.image.length > 0) {
        productData.image_url = req.files.image[0].path;
      }

      // Xử lý ảnh phụ nếu có cập nhật
      if (req.files.images && req.files.images.length > 0) {
        productData.additional_images = req.files.images.map(
          (file) => file.path
        );
      }

      // Xử lý ảnh cho biến thể nếu có cập nhật
      if (req.files.variations && req.files.variations.length > 0) {
        productData.variation_images = req.files.variations.map(
          (file) => file.path
        );
      }
    }

    console.log("Product data being updated:", productData);

    const userId = req.user.id;
    const result = await productService.updateProduct(
      product_id,
      productData,
      userId
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật sản phẩm",
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
    console.error("Error deleting product image:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa hình ảnh sản phẩm",
      error: error.message,
    });
  }
};

// Nhớ export hàm này
module.exports = {
  // ... các hàm khác
  createProduct,
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
  createProduct,
  updateProduct,
  deleteProductImage,
};
