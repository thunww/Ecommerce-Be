const { Shop, User } = require("../models");

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
    const shop = await Shop.findByPk(shopId, {
      include: {
        model: User,
        attributes: ["username"],
      },
    });

    if (!shop) {
      return { success: false, message: "Shop not found" };
    }

    return {
      success: true,
      message: "Get shop by ID successfully",
      data: shop,
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
