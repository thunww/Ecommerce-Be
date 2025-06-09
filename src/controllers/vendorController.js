const vendorService = require("../services/vendorService");
const OpenAI = require("openai");
const {
  getRevenue,
  getShopRevenue,
  getShopRating,
  getShopProducts,
  processOrderItem,
  getAllOrders,
  getOrdersWithFilter,
  updateSubordersStatusToProcessing,
  getShopAnalytics,
  deleteSubordersByIds,
  getOrdersForExport,
  filterShopProducts,
} = require("../services/vendorService");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const path = require("path");
const moment = require("moment");

// Lấy thông tin shop của vendor
const handleGetMyShop = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const shop = await vendorService.getShopByUserId(userId);
    if (!shop) {
      return res.status(404).json({ message: "Không tìm thấy thông tin shop" });
    }

    res.json(shop);
  } catch (error) {
    console.error("Error in handleGetMyShop:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng
const handleGetAllOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const orders = await vendorService.getAllOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error in handleGetAllOrders:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng!" });
  }
};
// Lấy danh sách đơn hàng với phân trang và filter
const handleGetOrdersWithFilter = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ middleware xác thực
    const { status, startDate, endDate, search } = req.query;

    const filterParams = {
      status: status || undefined, // Chỉ truyền status nếu có
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      search: search || undefined,
    };

    const result = await getOrdersWithFilter(userId, filterParams);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi trong handleGetOrdersWithFilter:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi lấy danh sách đơn hàng",
    });
  }
};

// Lấy doanh thu tổng
const handleGetRevenue = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const revenue = await getRevenue(userId);
    res.json(revenue);
  } catch (error) {
    console.error("Error in handleGetRevenue:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy thống kê shop
const handleGetShopAnalytics = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const analytics = await vendorService.getShopAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error("Error in handleGetShopAnalytics:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin shop
const handleUpdateShop = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const shopData = req.body;

    const updatedShop = await vendorService.updateShop(userId, shopData);
    res.json(updatedShop);
  } catch (error) {
    console.error("Error in handleUpdateShop:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật logo shop
const handleUpdateShopLogo = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const logoFile = req.file;

    const updatedShop = await vendorService.updateShopLogo(userId, logoFile);
    res.json(updatedShop);
  } catch (error) {
    console.error("Error in handleUpdateShopLogo:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật banner shop
const handleUpdateShopBanner = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const bannerFile = req.file;

    const updatedShop = await vendorService.updateShopBanner(
      userId,
      bannerFile
    );
    res.json(updatedShop);
  } catch (error) {
    console.error("Error in handleUpdateShopBanner:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy đánh giá shop
const handleGetShopReviews = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await vendorService.getShopReviews(userId, { page, limit });
    res.json(reviews);
  } catch (error) {
    console.error("Error in handleGetShopReviews:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy rating của shop
const handleGetShopRating = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const ratingData = await getShopRating(userId);

    res.json(ratingData);
  } catch (error) {
    console.error("Error in handleGetShopRating:", error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const handleAIChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý AI cho vendor, giúp họ quản lý cửa hàng và sản phẩm.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error in handleAIChat:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Lấy danh sách sản phẩm của shop
const handleGetShopProducts = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1; // Mặc định trang 1
    const limit = parseInt(req.query.limit) || 9; // Mặc định 9 sản phẩm mỗi trang
    const search = req.query.search || ""; // Tìm kiếm theo tên
    const categoryId = req.query.categoryId || null; // Lọc theo category
    const sortBy = req.query.sortBy || "name"; // Sắp xếp theo tiêu chí

    const products = await getShopProducts(userId, {
      page,
      limit,
      search,
      categoryId,
      sortBy,
    });
    res.json(products);
  } catch (error) {
    console.error("Error in handleGetShopProducts:", error);
    res.status(500).json({ message: error.message });
  }
};

// Process đơn hàng
const handleProcessProduct = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { product_id } = req.params;

    console.log("Processing product request:", {
      userId,
      product_id,
      user: req.user,
    });

    // Gọi service để process sản phẩm
    const processedProduct = await vendorService.processProduct(
      userId,
      product_id
    );

    res.json({
      success: true,
      message: "Product processed successfully",
      data: processedProduct,
    });
  } catch (error) {
    console.error("Error in handleProcessProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process product",
    });
  }
};

const handleUpdateSubordersStatusToProcessing = async (req, res) => {
  try {
    const { subOrderIds } = req.body; // Mong đợi mảng subOrderIds trong body

    if (!Array.isArray(subOrderIds) || subOrderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty subOrderIds list provided.",
      });
    }

    const result = await updateSubordersStatusToProcessing(subOrderIds);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Successfully updated status for ${result.affectedCount} suborders.`,
        affectedCount: result.affectedCount,
      });
    } else {
      // Service returned false but didn't throw, likely no matching orders found
      res.status(404).json({
        success: false,
        message:
          result.message ||
          "No matching suborders found or status already processing.",
      });
    }
  } catch (error) {
    console.error(
      "Error in handleUpdateSubordersStatusToProcessing controller:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Internal server error while updating suborder status.",
    });
  }
};

const handleDeleteSuborders = async (req, res) => {
  try {
    const { subOrderIds } = req.body; // Mong đợi mảng subOrderIds trong body

    if (!Array.isArray(subOrderIds) || subOrderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty subOrderIds list provided.",
      });
    }

    const result = await deleteSubordersByIds(subOrderIds);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} suborders.`,
        deletedCount: result.deletedCount,
      });
    } else {
      // Service returned false but didn't throw, likely no matching orders found
      res.status(404).json({
        success: false,
        message: result.message || "No matching suborders found.",
      });
    }
  } catch (error) {
    console.error("Error in handleDeleteSuborders controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting suborders.",
    });
  }
};

const handleExportOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { status, startDate, endDate, search } = req.query;

    const orders = await vendorService.getOrdersForExport(userId, {
      status,
      startDate,
      endDate,
      search,
    });

    // Chuẩn bị dữ liệu CSV
    const csvData = orders.map((order) => {
      // Tính tổng tiền cho từng sản phẩm: đơn giá * số lượng * (1 - giảm giá/100)
      const itemTotal = order.orderItems.map((item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const discount = parseFloat(item.discount) || 0;
        return price * quantity * (1 - discount / 100);
      });

      // Tổng tiền = tổng tiền sản phẩm + phí ship
      const totalAmount =
        itemTotal.reduce((sum, amount) => sum + amount, 0) +
        parseFloat(order.shipping_fee || 0);

      return {
        "Mã đơn hàng": order.sub_order_id,
        "Mã đơn hàng gốc": order.order_id,
        "Trạng thái": order.status,
        "Tổng tiền": `${totalAmount.toLocaleString("vi-VN")}đ`,
        "Phí vận chuyển": `${parseFloat(order.shipping_fee || 0).toLocaleString(
          "vi-VN"
        )}đ`,
        "Ngày đặt": order.created_at
          ? moment(order.created_at).format("DD/MM/YYYY HH:mm")
          : "",
        "Tên sản phẩm": order.orderItems
          .map(
            (item) =>
              `${item.product_name} (${item.quantity}x)${
                item.size ? ` - ${item.size}` : ""
              }${item.color ? ` - ${item.color}` : ""}`
          )
          .join("\n"),
        "Đơn giá": `${parseFloat(
          order.orderItems[0]?.price || 0
        ).toLocaleString("vi-VN")}đ`,
        "Giảm giá": `${parseFloat(
          order.orderItems[0]?.discount || 0
        ).toLocaleString("vi-VN")}%`,
        "Thành tiền": `${itemTotal[0].toLocaleString("vi-VN")}đ`,
        "Khách hàng": `${order.customer?.username || ""} (${
          order.customer?.phone || ""
        })`,
        Email: order.customer?.email || "",
        "Người nhận": order.shipping_address?.recipient_name || "",
        "SĐT người nhận": order.shipping_address?.phone || "",
        "Địa chỉ": [
          order.shipping_address?.address_line,
          order.shipping_address?.ward,
          order.shipping_address?.district,
          order.shipping_address?.city,
        ]
          .filter(Boolean)
          .join(", "),
      };
    });

    // Tạo header cho CSV
    const headers = [
      "Mã đơn hàng",
      "Mã đơn hàng gốc",
      "Trạng thái",
      "Tổng tiền",
      "Phí vận chuyển",
      "Ngày đặt",
      "Tên sản phẩm",
      "Đơn giá",
      "Giảm giá",
      "Thành tiền",
      "Khách hàng",
      "Email",
      "Người nhận",
      "SĐT người nhận",
      "Địa chỉ",
    ];

    // Tạo nội dung CSV
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            // Escape các ký tự đặc biệt trong CSV
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    // Thiết lập header cho response
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");

    // Gửi file CSV
    res.send(csvContent);
  } catch (error) {
    console.error("Error in handleExportOrders:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi xuất dữ liệu đơn hàng: ${error.message}`,
    });
  }
};

// Controller to handle fetching paginated suborders with order items
const handleGetSubordersWithOrderItemsPaginated = async (req, res) => {
  try {
    const userId = req.user.user_id; // Assuming user ID is attached to req.user
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Đọc các tham số lọc từ request query
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const search = req.query.search;

    // Truyền tất cả các tham số (bao gồm phân trang và lọc) vào hàm service
    const result = await vendorService.getSubordersWithOrderItemsPaginated(
      userId,
      {
        page,
        limit,
        status, // Truyền tham số status
        startDate, // Truyền tham số startDate
        endDate, // Truyền tham số endDate
        search, // Truyền tham số search
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error in handleGetSubordersWithOrderItemsPaginated controller:",
      error
    );
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi lấy danh sách suborders",
    });
  }
};

const handleUpdateProduct = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { product_id } = req.params;
    let {
      product_name,
      description,
      discount,
      dimensions,
      weight,
      variants,
      category,
      stock,
    } = req.body;

    // Parse variants nếu là string
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    // Lấy thông tin ảnh đã upload từ middleware
    const uploadedImages = req.uploadedImages || [];

    // Tạo object chứa dữ liệu cập nhật cho sản phẩm
    const productUpdateData = {
      product_name,
      description,
      discount,
      dimensions,
      weight,
      category,
      stock,
    };

    // Xử lý ảnh cho từng variant
    if (variants && Array.isArray(variants)) {
      variants.forEach((variant) => {
        const variantImage = uploadedImages.find(
          (img) => img.fieldname === `variantImage_${variant.variant_id}`
        );
        if (variantImage) {
          variant.image_url = variantImage.path;
        }
      });
    }

    // Gọi service để cập nhật sản phẩm và các variant
    const updatedProduct = await vendorService.updateProduct(
      userId,
      product_id,
      productUpdateData,
      variants
    );

    // Trả về kết quả thành công
    res.status(200).json({
      success: true,
      message: "Sản phẩm và các biến thể đã được cập nhật thành công",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error in handleUpdateProduct:", error);

    // Xử lý các loại lỗi cụ thể
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: error.errors,
      });
    }

    if (error.name === "NotFoundError") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm hoặc biến thể",
      });
    }

    // Trả về lỗi mặc định
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật sản phẩm",
    });
  }
};

// Xóa một variant của sản phẩm
const handleDeleteVariant = async (req, res) => {
  try {
    const userId = req.user.user_id; // Lấy user ID từ token
    const { product_id, variant_id } = req.params;

    await vendorService.deleteVariant(userId, product_id, variant_id);

    res.status(200).json({ message: "Variant đã được xóa thành công." });
  } catch (error) {
    console.error("Lỗi trong handleDeleteVariant:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi xóa variant",
    });
  }
};

const handleCreateProduct = async (req, res) => {
  try {
    const userId = req.user.user_id;
    let {
      product_name,
      description,
      discount,
      dimensions,
      weight,
      variants,
      stock,
      category,
    } = req.body;

    console.log("Stock received in controller (req.body.stock):", stock);

    // Parse variants nếu là string
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    // Lấy thông tin ảnh đã upload từ middleware
    const uploadedImages = req.uploadedImages || [];

    // Tạo object chứa dữ liệu cho sản phẩm mới
    const productData = {
      product_name,
      description,
      discount,
      dimensions,
      weight,
      stock,
      category,
    };

    // Xử lý ảnh cho từng variant
    if (variants && Array.isArray(variants)) {
      variants.forEach((variant, index) => {
        const variantImage = uploadedImages.find(
          (img) => img.fieldname === `variantImage_${index}`
        );
        if (variantImage) {
          variant.image_url = variantImage.path;
        }
      });
    }

    // Gọi service để tạo sản phẩm và các variant
    const newProduct = await vendorService.createProduct(
      userId,
      productData,
      variants
    );

    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      message: "Sản phẩm và các biến thể đã được tạo thành công",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error in handleCreateProduct:", error);

    // Xử lý các loại lỗi cụ thể
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: error.errors,
      });
    }

    // Trả về lỗi mặc định
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tạo sản phẩm",
    });
  }
};

// Đăng ký trở thành vendor
const handleRegisterVendor = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      
      shopName,
      description,
      address,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!shopName || !address ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    // Gọi service để đăng ký vendor
    const result = await vendorService.registerVendor(
      userId,
      {
       
        shopName,
        description,
        address,
        
      },
      req.uploadedImages
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng chờ xét duyệt.",
      data: result,
    });
  } catch (error) {
    console.error("Error in handleRegisterVendor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Đăng ký thất bại. Vui lòng thử lại!",
    });
  }
};

module.exports = {
  handleGetMyShop,
  handleGetAllOrders,
  handleGetRevenue,
  handleGetShopAnalytics,
  handleUpdateShop,
  handleUpdateShopLogo,
  handleUpdateShopBanner,
  handleGetShopReviews,
  handleGetShopRating,
  handleAIChat,
  handleGetShopProducts,
  handleProcessProduct,
  handleGetOrdersWithFilter,
  handleUpdateSubordersStatusToProcessing,
  handleDeleteSuborders,
  handleExportOrders,
  handleGetSubordersWithOrderItemsPaginated,
  handleUpdateProduct,
  handleDeleteVariant,
  handleCreateProduct,
  handleRegisterVendor,
};
