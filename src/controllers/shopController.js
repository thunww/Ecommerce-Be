const {
  getAllShops,
  assingStatusToShop,
  getShopById,
  getShopProducts,
} = require("../services/shopService");

const orderService = require("../services/orderService");

const handleGetAllShops = async (req, res) => {
  try {
    const shops = await getAllShops();
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleAssignStatusToShop = async (req, res) => {
  try {
    const { shopId, status } = req.body;
    const result = await assingStatusToShop(shopId, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleGetShopById = async (req, res) => {
  try {
    const { shopId } = req.params;
    const result = await getShopById(shopId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching shop by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleGetShopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    console.log("Getting products for shop:", shopId);
    console.log("Pagination:", { page, limit });

    const result = await getShopProducts(
      shopId,
      parseInt(page),
      parseInt(limit)
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching shop products:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getOrderedProducts = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Nếu là vendor, chỉ cho phép xem shop của mình
    if (req.user.role === "vendor" && req.user.shop_id !== parseInt(shopId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập thông tin của shop này",
      });
    }

    const products = await orderService.getShopOrderedProducts(shopId);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm đã bán:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleGetAllShops,
  handleAssignStatusToShop,
  handleGetShopById,
  handleGetShopProducts,
  getOrderedProducts,
};
