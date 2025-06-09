const productService = require("../services/productService");
const { Shop } = require("../models");
const Product = require("../models/product");
const { deleteImagesByUrls } = require("../utils/cloudinaryHelper");

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
// BE/src/controllers/productController.js
// BE/src/controllers/productController.js

const checkDuplicateProductName = async (req, res, next) => {
  try {
    // Lấy userId từ token xác thực
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập hoặc token không hợp lệ",
      });
    }

    const userId = req.user.user_id;
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tên sản phẩm",
      });
    }

    // Tìm shop dựa vào userId
    const shop = await Shop.findOne({ where: { owner_id: userId } });
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy thông tin shop",
      });
    }

    // Kiểm tra tên sản phẩm đã tồn tại chưa
    const existingProduct = await Product.findOne({
      where: {
        product_name: productName,
        shop_id: shop.shop_id,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Sản phẩm có tên "${productName}" đã tồn tại trong shop của bạn. Vui lòng chọn tên khác.`,
      });
    }

    // Lưu shop_id vào req để sử dụng sau
    req.shop_id = shop.shop_id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi kiểm tra tên sản phẩm",
      error: error.message,
    });
  }
};

// Hàm xử lý tạo sản phẩm
const createProduct = async (req, res, next) => {
  try {
    // Lấy userId từ token xác thực
    if (!req.user || !req.user.user_id) {
      if (req.uploadedImages && req.uploadedImages.length > 0) {
        await deleteImagesByUrls(req.uploadedImages);
      }
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    const userId = req.user.user_id;

    // Kiểm tra các trường bắt buộc
    const { productName, price, stock, category } = req.body;
    if (!productName || !price || !stock || !category) {
      if (req.uploadedImages && req.uploadedImages.length > 0) {
        await deleteImagesByUrls(req.uploadedImages);
      }
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // Tìm shop của user
    const shop = await Shop.findOne({ where: { owner_id: userId } });
    if (!shop) {
      if (req.uploadedImages && req.uploadedImages.length > 0) {
        await deleteImagesByUrls(req.uploadedImages);
      }
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy shop",
      });
    }

    // KIỂM TRA TÊN TRÙNG TỪ req.body
    const existingProduct = await Product.findOne({
      where: { product_name: productName, shop_id: shop.shop_id },
    });

    if (existingProduct) {
      // Nếu tên trùng, xóa ảnh đã upload
      if (req.uploadedImages && req.uploadedImages.length > 0) {
        await deleteImagesByUrls(req.uploadedImages);
      }
      return res.status(400).json({
        success: false,
        message: `Sản phẩm có tên "${productName}" đã tồn tại trong shop của bạn. Vui lòng chọn tên khác.`,
      });
    }

    // Xử lý các trường JSON
    let parsedVariations = [];
    if (req.body.variations) {
      try {
        parsedVariations =
          typeof req.body.variations === "string"
            ? JSON.parse(req.body.variations)
            : req.body.variations;

        if (!Array.isArray(parsedVariations)) {
          parsedVariations = [];
        }
      } catch (e) {
        console.error("Lỗi parse variations:", e);
        parsedVariations = [];
      }
    }

    let parsedParcelSize = null;
    if (req.body.parcelSize) {
      try {
        parsedParcelSize =
          typeof req.body.parcelSize === "string"
            ? JSON.parse(req.body.parcelSize)
            : req.body.parcelSize;
      } catch (e) {
        console.error("Lỗi parse parcelSize:", e);
        parsedParcelSize = { width: 20, height: 10, length: 5 };
      }
    }

    // Xử lý dữ liệu ảnh
    let cloudinaryImages = req.uploadedImages || [];
    let primaryImageUrl = null;

    if (req.files && req.files.primaryImage && req.files.primaryImage[0]) {
      primaryImageUrl = req.files.primaryImage[0].path;
    } else if (cloudinaryImages.length > 0) {
      primaryImageUrl = cloudinaryImages[0];
    }

    // Gọi service để tạo sản phẩm
    const result = await productService.createProduct({
      productName,
      description: req.body.description,
      price,
      stock,
      category,
      userId,
      shop_id: shop.shop_id,
      primaryImageUrl,
      images: cloudinaryImages,
      variations: parsedVariations,
      parcelSize: parsedParcelSize,
      weight: req.body.weight,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    // Chuyển lỗi cho middleware handleProductError xử lý
    next(error);
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
const suggestProducts = async (req, res) => {
  try {
    const { q = "", limit = 5 } = req.query;

    const result = await productService.searchSuggest(q, limit);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
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

const getProductDetails = async (req, res) => {
  try {
    let { productIds, variantIds } = req.query;
    console.log("productIds:", productIds);
    console.log("variantIds:", variantIds);

    // Chuyển string "1,2,3" => [1, 2, 3]
    if (typeof productIds === "string") {
      productIds = productIds.split(",").map((id) => parseInt(id));
    }
    if (typeof variantIds === "string") {
      variantIds = variantIds.split(",").map((id) => parseInt(id));
    }

    const result = await productService.getProductsByIdsAndVariants(
      productIds,
      variantIds
    );

    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      data: null,
    });
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

    // Chuyển đổi product_id thành mảng
    const product_ids = product_id.split(",").map((id) => parseInt(id.trim()));

    // Kiểm tra nếu có ID không hợp lệ
    if (product_ids.some(isNaN)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const result = await productService.deleteProduct(product_ids);

    res.status(200).json(result);
  } catch (error) {
    if (error.message === "No products found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Invalid product IDs array") {
      return res.status(400).json({ success: false, message: error.message });
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
  suggestProducts,
  deleteProductImage,
  createProduct, // Thêm hàm mới
  checkDuplicateProductName,
  getProductDetails,
};
