const vendorService = require("../services/vendorService");
const OpenAI = require("openai");
const {
  getRevenue,
  getShopRevenue,
  getShopRating,
  getShopProducts,
  processOrderItem,
} = require("../services/vendorService");

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

// Lấy doanh thu shop
const handleGetShopRevenue = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const revenue = await getShopRevenue(userId);
    res.json(revenue);
  } catch (error) {
    console.error("Error in handleGetShopRevenue:", error);
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

    const products = await getShopProducts(userId);
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

module.exports = {
  handleGetMyShop,
  handleGetShopRevenue,
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
};
