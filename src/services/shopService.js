const { Shop, User, Product, ShopReview } = require("../models");
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
      include: {
        model: User,
        attributes: ["username"],
      },
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

    // Lấy tổng số sản phẩm của shop
    const productCount = await Product.count({
      where: { shop_id: shopId },
    });

    // Lấy thông tin chi tiết của shop
    const shopData = shop.toJSON();

    // Tính toán rating từ shop_reviews
    const rating = reviewStats[0]?.average_rating
      ? parseFloat(reviewStats[0].average_rating).toFixed(1)
      : 0;

    // Thêm thông tin đánh giá và số lượng sản phẩm
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

module.exports = {
  getAllShops,
  assingStatusToShop,
  getShopById,
};
