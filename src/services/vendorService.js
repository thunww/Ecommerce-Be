const {
  Shop,
  Order,
  SubOrder,
  Product,
  ShopReview,
  OrderItem,
  ProductImage,
  Category,
} = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");

// Lấy shop theo user ID
const getShopByUserId = async (userId) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });
    return shop;
  } catch (error) {
    console.error("Error in getShopByUserId:", error);
    throw new Error("Không thể lấy thông tin shop");
  }
};

// Lấy doanh thu của shop
const getShopRevenue = async (userId) => {
  try {
    // Tìm shop của user
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Lấy tất cả suborders của shop đã hoàn thành
    const revenue = await SubOrder.findAll({
      where: {
        shop_id: shop.shop_id,
        status: {
          [Op.in]: ["delivered"],
        },
      },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("total_price")), "totalRevenue"],
        [sequelize.fn("COUNT", sequelize.col("sub_order_id")), "totalOrders"],
      ],
      raw: true,
    });

    return {
      totalRevenue: revenue[0].totalRevenue || 0,
      totalOrders: revenue[0].totalOrders || 0,
    };
  } catch (error) {
    console.error("Error in getShopRevenue:", error);
    throw new Error("Không thể tính doanh thu");
  }
};

// Lấy tất cả đơn hàng của shop
const getAllOrders = async (userId) => {
  try {
    console.log("=== Getting All Orders ===");
    console.log("User ID:", userId);

    // Tìm shop của vendor
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      raw: true,
    });

    console.log("Found Shop:", shop);

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Lấy tất cả đơn hàng của shop với thông tin chi tiết
    const orders = await SubOrder.findAll({
      where: { shop_id: shop.shop_id },
      attributes: [
        "sub_order_id",
        "order_id",
        "total_price",
        "shipping_fee",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Order,
          attributes: [
            "order_id",
            "user_id",
            "total_price",
            "payment_status",
            "note",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      raw: true,
      nest: true,
    });

    console.log("Found Orders:", JSON.stringify(orders, null, 2));
    console.log("=== End Getting All Orders ===\n");

    return orders;
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw new Error(`Không thể lấy danh sách đơn hàng: ${error.message}`);
  }
};

// Lấy doanh thu tổng
const getRevenue = async (userId) => {
  try {
    console.log("=== Getting Revenue ===");
    console.log("User ID:", userId);

    const shop = await Shop.findOne({
      where: { owner_id: userId },
      raw: true,
    });

    console.log("Found Shop:", shop);

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Lấy tất cả đơn hàng của shop (cả đã giao và chưa giao)
    const totalOrders = await SubOrder.count({
      where: {
        shop_id: shop.shop_id,
      },
    });

    // Log tất cả các đơn hàng đã giao của shop
    const allOrders = await SubOrder.findAll({
      where: {
        shop_id: shop.shop_id,
        status: "delivered", // Chỉ lấy đơn hàng đã giao
      },
      attributes: [
        "sub_order_id",
        "order_id",
        "shop_id",
        "total_price",
        "shipping_fee",
        "status",
        "created_at",
        "updated_at",
      ],
    });
    console.log("All delivered orders for shop:", allOrders);

    // Tính tổng giá trị đơn hàng (total_price + shipping_fee)
    const totalValue = allOrders.reduce((sum, order) => {
      const orderTotal = parseFloat(order.total_price) || 0;
      const shippingFee = parseFloat(order.shipping_fee) || 0;
      return sum + orderTotal + shippingFee;
    }, 0);

    console.log("Total value (including shipping):", totalValue);

    // Lấy số lượt xem shop
    const shopViews = shop.views || 0;

    const result = {
      totalRevenue: totalValue,
      totalOrders: totalOrders, // Tổng số đơn hàng
      deliveredOrders: allOrders.length, // Số đơn hàng đã giao
      views: shopViews,
      deliveredOrdersList: allOrders,
    };

    console.log("Final Result:", result);
    console.log("=== End Getting Revenue ===\n");

    return result;
  } catch (error) {
    console.error("Error in getRevenue:", error);
    throw new Error("Không thể tính doanh thu");
  }
};

// Lấy thống kê shop
const getShopAnalytics = async (userId) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Lấy thống kê đơn hàng theo trạng thái
    const orderStats = await SubOrder.findAll({
      where: { shop_id: shop.shop_id },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("sub_order_id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Lấy thống kê sản phẩm
    const productStats = await Product.findAll({
      where: { shop_id: shop.shop_id },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("product_id")), "totalProducts"],
        [sequelize.fn("AVG", sequelize.col("price")), "averagePrice"],
      ],
      raw: true,
    });

    return {
      orderStats,
      productStats: {
        totalProducts: parseInt(productStats[0].totalProducts) || 0,
        averagePrice: parseFloat(productStats[0].averagePrice) || 0,
      },
      views: shop.views || 0,
    };
  } catch (error) {
    console.error("Error in getShopAnalytics:", error);
    throw new Error("Không thể lấy thống kê shop");
  }
};

// Cập nhật thông tin shop
const updateShop = async (userId, shopData) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    await shop.update(shopData);
    return shop;
  } catch (error) {
    console.error("Error in updateShop:", error);
    throw new Error("Không thể cập nhật thông tin shop");
  }
};

// Cập nhật logo shop
const updateShopLogo = async (userId, logoFile) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Xử lý upload file và lưu đường dẫn
    const logoPath = `/uploads/shops/${shop.shop_id}/logo/${logoFile.filename}`;
    await shop.update({ logo: logoPath });

    return shop;
  } catch (error) {
    console.error("Error in updateShopLogo:", error);
    throw new Error("Không thể cập nhật logo shop");
  }
};

// Cập nhật banner shop
const updateShopBanner = async (userId, bannerFile) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Xử lý upload file và lưu đường dẫn
    const bannerPath = `/uploads/shops/${shop.shop_id}/banner/${bannerFile.filename}`;
    await shop.update({ banner: bannerPath });

    return shop;
  } catch (error) {
    console.error("Error in updateShopBanner:", error);
    throw new Error("Không thể cập nhật banner shop");
  }
};

// Lấy đánh giá shop
const getShopReviews = async (userId, { page = 1, limit = 10 }) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { shop_id: shop.shop_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["product_name"],
        },
      ],
    });

    return {
      reviews: reviews.rows,
      total: reviews.count,
      currentPage: page,
      totalPages: Math.ceil(reviews.count / limit),
    };
  } catch (error) {
    console.error("Error in getShopReviews:", error);
    throw new Error("Không thể lấy đánh giá shop");
  }
};

// Lấy chi tiết đơn hàng bao gồm sản phẩm
const getOrderDetails = async (subOrderId) => {
  try {
    console.log("=== Getting Order Details ===");
    console.log("SubOrder ID:", subOrderId);

    const orderDetails = await SubOrder.findOne({
      where: { sub_order_id: subOrderId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              attributes: ["product_id", "product_name", "price", "discount"],
            },
          ],
        },
      ],
    });

    if (!orderDetails) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    console.log("Found Order Details:", JSON.stringify(orderDetails, null, 2));
    console.log("=== End Getting Order Details ===\n");

    return orderDetails;
  } catch (error) {
    console.error("Error in getOrderDetails:", error);
    throw new Error(`Không thể lấy chi tiết đơn hàng: ${error.message}`);
  }
};

// Lấy rating của shop
const getShopRating = async (userId) => {
  try {
    console.log("=== Getting Shop Rating ===");
    console.log("User ID:", userId);

    // Tìm shop của vendor
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      attributes: ["shop_id", "shop_name", "rating"],
      raw: true,
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    console.log("Found Shop:", shop);

    // Lấy tất cả đánh giá của shop
    const reviews = await ShopReview.findAndCountAll({
      where: { shop_id: shop.shop_id },
      attributes: ["rating"],
      raw: true,
    });

    console.log("Shop Reviews:", reviews);

    // Trả về rating từ thông tin shop
    const result = {
      averageRating: parseFloat(shop.rating) || 0,
      totalReviews: reviews.count,
    };

    console.log("Final Rating Result:", result);
    console.log("=== End Getting Shop Rating ===\n");

    return result;
  } catch (error) {
    console.error("Error in getShopRating:", error);
    throw new Error(`Không thể lấy đánh giá shop: ${error.message}`);
  }
};

// Lấy danh sách sản phẩm của shop
const getShopProducts = async (userId) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    const products = await Product.findAll({
      where: { shop_id: shop.shop_id },
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_url"],
          // required: true, // Chỉ lấy sản phẩm có hình ảnh
        },
        {
          model: Category,
          as: "Category",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Chuyển đổi dữ liệu để lấy hình ảnh đầu tiên làm ảnh chính
    const formattedProducts = products.map(product => {
      const productData = product.get({ plain: true });
      return {
        ...productData,
        main_image: productData.images[0]?.image_url || null,
        images: productData.images.map(img => img.image_url)
      };
    });

    return formattedProducts;
  } catch (error) {
    console.error("Error in getShopProducts:", error);
    throw new Error("Không thể lấy danh sách sản phẩm của shop");
  }
};

module.exports = {
  getShopByUserId,
  getShopRevenue,
  getAllOrders,
  getRevenue,
  getShopAnalytics,
  updateShop,
  updateShopLogo,
  updateShopBanner,
  getShopReviews,
  getOrderDetails,
  getShopRating,
  getShopProducts,
};
