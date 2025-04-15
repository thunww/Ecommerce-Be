const vendorService = require("../services/vendorService");
const OpenAI = require("openai");
const {
  getRevenue,
  getShopRevenue,
  getShopRating,
  getShopProducts,
} = require("../services/vendorService");

// Lấy thông tin shop của vendor
const handleGetMyShop = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log("Getting shop info for user:", userId);

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
    console.log("Getting shop revenue for user:", userId);

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
    console.log("Getting all orders for user:", userId);

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
    console.log("Getting revenue for user:", userId);

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
    console.log("Getting shop analytics for user:", userId);

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
    console.log("Updating shop for user:", userId, "with data:", shopData);

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
    console.log("Updating shop logo for user:", userId);

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
    console.log("Updating shop banner for user:", userId);

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
    console.log("Getting shop reviews for user:", userId);

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
    console.log("=== Getting Shop Rating ===");
    console.log("User ID from token:", userId);
    console.log("User info:", req.user);

    const ratingData = await getShopRating(userId);
    console.log("Rating data result:", ratingData);

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
    console.log("Received message:", message);

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
    console.log("Getting shop products for user:", userId);

    const products = await getShopProducts(userId);
    res.json(products);
  } catch (error) {
    console.error("Error in handleGetShopProducts:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
const handleUpdateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { order_id } = req.params;
    const { status } = req.body;

    console.log(
      `Updating order ${order_id} status to ${status} by user ${userId}`
    );

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Status must be one of: pending, processing, shipped, delivered, cancelled",
      });
    }

    // Call service to update order status
    const updatedOrder = await vendorService.updateOrderStatus(
      userId,
      order_id,
      status
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error in handleUpdateOrderStatus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
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
  handleUpdateOrderStatus,
};
