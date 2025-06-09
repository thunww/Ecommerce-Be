const {
  Shop,
  User,
  Product,
  ShopReview,
  ProductVariant,
  Order,
  SubOrder,
  OrderItem,
} = require("../models");
const { sequelize } = require("../models");

const getAllShops = async () => {
  try {
    const shops = await Shop.findAll({
      include: {
        model: User,
        attributes: ["username"],
      },
      order: [["created_at", "DESC"]],
    });

    return {
      success: true,
      message: "Get list of shops successfully",
      data: shops,
    };
  } catch (error) {
    console.error("Error getting shops:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const getShopById = async (shopId) => {
  try {
    // Lấy thông tin shop
    const shop = await Shop.findByPk(shopId, {
      include: [
        {
          model: Product,
          as: "products",
          where: { status: "active" },
          required: false,
          include: [
            {
              model: ProductVariant,
              as: "variants",
            },
          ],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    if (!shop) {
      return { success: false, message: "Shop not found" };
    }

    // Lấy thông tin đánh giá từ bảng shop_reviews
    const reviewStats = await ShopReview.findAll({
      where: { shop_id: shopId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("review_id")), "total_reviews"],
        [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
      ],
      raw: true,
    });

    // Lấy tổng số sản phẩm (active)
    const productCount = await Product.count({
      where: { shop_id: shopId, status: "active" },
    });

    // Convert to JSON
    const shopData = shop.toJSON();

    // Tính rating
    const rating = reviewStats[0]?.average_rating
      ? parseFloat(reviewStats[0].average_rating).toFixed(1)
      : 0;

    // Thêm thống kê
    shopData.total_reviews = reviewStats[0]?.total_reviews || 0;
    shopData.total_products = productCount;
    shopData.rating = rating;

    return {
      success: true,
      message: "Get shop by ID successfully",
      data: shopData,
    };
  } catch (error) {
    console.error("Error getting shop by ID:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const assingStatusToShop = async (shopId, status) => {
  try {
    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return { success: false, message: "Shop not found" };
    }

    shop.status = status;
    await shop.save();

    return {
      success: true,
      message: "Shop status updated successfully",
      data: shop,
    };
  } catch (error) {
    return { success: false, message: "Internal Server Error" };
  }
};

const getMyShop = async (userId) => {
  try {
    // Tìm shop dựa trên owner_id
    let shop = await Shop.findOne({
      where: { owner_id: userId },
      include: [
        {
          model: Product,
          as: "products",
          where: { status: "active" },
          required: false,
          include: [
            {
              model: ProductVariant,
              as: "variants",
            },
          ],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    if (!shop) {
      return {
        success: false,
        message: "Shop not found for this user",
      };
    }

    // Lấy thông tin đánh giá từ bảng shop_reviews
    const reviewStats = await ShopReview.findAll({
      where: { shop_id: shop.shop_id },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("review_id")), "total_reviews"],
        [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
      ],
      raw: true,
    });

    // Lấy tổng số sản phẩm (active)
    const productCount = await Product.count({
      where: {
        shop_id: shop.shop_id,
        status: "active",
      },
    });

    // Convert to JSON
    const shopData = shop.toJSON();

    // Tính rating
    const rating = reviewStats[0]?.average_rating
      ? parseFloat(reviewStats[0].average_rating).toFixed(1)
      : 0;

    // Thêm thống kê
    shopData.total_reviews = reviewStats[0]?.total_reviews || 0;
    shopData.total_products = productCount;
    shopData.rating = rating;

    // Tính doanh thu từ SubOrder
    const totalRevenue = await SubOrder.findAll({
      where: {
        shop_id: shop.shop_id,
        status: "delivered",
      },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
        
      ],
      raw: true,
    });

    // Thống kê đơn hàng theo trạng thái SubOrder
    const orderStats = await SubOrder.findAll({
      where: { shop_id: shop.shop_id },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("sub_order_id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Tính tổng doanh thu và định dạng số
    const totalPrice = parseFloat(totalRevenue[0]?.total_price || 0);
    const totalShipping = parseFloat(totalRevenue[0]?.total_shipping || 0);
    const totalRevenueSum = (totalPrice + totalShipping).toFixed(2);

    // Thêm thông tin doanh thu và đơn hàng vào shopData
    shopData.total_revenue = totalRevenueSum;
    shopData.order_stats = orderStats.reduce((acc, curr) => {
      acc[curr.status] = parseInt(curr.count);
      return acc;
    }, {});

    return {
      success: true,
      message: "Get my shop successfully",
      data: shopData,
    };
  } catch (error) {
    console.error("Error getting my shop:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

module.exports = {
  getAllShops,
  assingStatusToShop,
  getShopById,
  getMyShop,
};
