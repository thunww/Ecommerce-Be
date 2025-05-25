const {
  User,
  Shop,
  Order,
  SubOrder,
  Product,
  ShopReview,
  OrderItem,
  ProductVariant,
  Category,
  Address,
} = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const Sequelize = require("sequelize");

// Lấy shop theo user ID
const getShopByUserId = async (userId) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      include: [
        {
          model: User,
          attributes: ["username", "email", "phone"],
        },
      ],
    });
    return shop;
  } catch (error) {
    throw new Error("Không thể lấy thông tin shop");
  }
};

const getAllOrders = async (userId) => {
  try {
    // Tìm shop của vendor
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      raw: true,
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Lấy tất cả suborders kèm theo orderItems, product, productVariant, order, user và addresses
    const Orders = await SubOrder.findAll({
      where: { shop_id: shop.shop_id },
      attributes: [],
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          attributes: [],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "product_name", "discount"],
            },
            {
              model: ProductVariant,
              as: "productVariant",
              attributes: ["variant_id", "image_url", "price"],
            },
          ],
        },
        {
          model: Order,
          as: "Order",
          attributes: [],
          include: [
            {
              model: User,
              // Không khai báo alias, sử dụng mặc định "User"
              attributes: ["user_id", "username", "phone", "email"],
              include: [
                {
                  model: Address,
                  as: "addresses",
                  attributes: [
                    "address_id",
                    "address_line",
                    "city",
                    "district",
                    "ward",
                  ],
                  required: false, // Cho phép trả về User ngay cả khi không có Address
                },
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    // Gộp thông tin product, variant, user và address lại, xử lý an toàn
    const mergedProducts = Orders.map((item) => ({
      product_id: item.orderItems.product?.product_id || null,
      product_name: item.orderItems.product?.product_name || null,
      discount: item.orderItems.product?.discount || null,
      variant_id: item.orderItems.productVariant?.variant_id || null,
      image_url: item.orderItems.productVariant?.image_url || null,
      price: item.orderItems.productVariant?.price || null,
      user_id: item.Order?.User?.user_id || null,
      username: item.Order?.User?.username || null,
      phone: item.Order?.User?.phone || null,
      email: item.Order?.User?.email || null,
      address_id: item.Order?.User?.addresses?.address_id || null, // Truy cập trực tiếp object addresses
      address_line: item.Order?.User?.addresses?.address_line || null,
      city: item.Order?.User?.addresses?.city || null,
      district: item.Order?.User?.addresses?.district || null,
      ward: item.Order?.User?.addresses?.ward || null,
    }));

    return {
      success: true,
      message: Orders.length
        ? "Lấy danh sách đơn hàng thành công"
        : "Không có đơn hàng nào",
      data: mergedProducts,
    };
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw new Error(`Không thể lấy danh sách đơn hàng: ${error.message}`);
  }
};

// Lấy danh sách đơn hàng với phân trang và filter

const getOrdersWithFilter = async (
  userId,
  { page = 1, limit = 7, status, startDate, endDate, search } = {}
) => {
  try {
    // Decode search term nếu có
    if (search) {
      search = decodeURIComponent(search);
      console.log("Decoded search term:", search);
    }

    console.log("Input params:", {
      userId,
      page,
      limit,
      status,
      startDate,
      endDate,
      search,
    });

    const shop = await Shop.findOne({
      where: { owner_id: userId },
      raw: true,
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    const offset = (page - 1) * limit;

    const subOrderWhere = { shop_id: shop.shop_id };
    if (status) {
      subOrderWhere.status = status;
    }

    const orderWhere = {};
    if (search && moment(search, "DD/MM/YYYY", true).isValid()) {
      const searchDate = moment
        .tz(search, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
        .startOf("day")
        .utc()
        .toDate();
      const searchDateEnd = moment
        .tz(search, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
        .endOf("day")
        .utc()
        .toDate();
      orderWhere.created_at = {
        [Op.between]: [searchDate, searchDateEnd],
      };
    } else if (startDate && endDate) {
      if (
        !moment(startDate, "YYYY-MM-DD", true).isValid() ||
        !moment(endDate, "YYYY-MM-DD", true).isValid()
      ) {
        throw new Error(
          "Định dạng startDate hoặc endDate không hợp lệ, yêu cầu định dạng YYYY-MM-DD"
        );
      }
      const start = moment
        .tz(startDate, "YYYY-MM-DD", "Asia/Ho_Chi_Minh")
        .startOf("day")
        .utc()
        .toDate();
      const end = moment
        .tz(endDate, "YYYY-MM-DD", "Asia/Ho_Chi_Minh")
        .endOf("day")
        .utc()
        .toDate();
      orderWhere.created_at = {
        [Op.between]: [start, end],
      };
    }

    const include = [
      {
        model: OrderItem,
        as: "orderItems",
        attributes: ["order_item_id", "quantity"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "discount"],
            ...(search && !moment(search, "DD/MM/YYYY", true).isValid()
              ? {
                  where: {
                    [Op.or]: [
                      { product_name: { [Op.like]: `%${search}%` } },
                      {
                        product_name: {
                          [Op.like]: `%${search.toLowerCase()}%`,
                        },
                      },
                      {
                        product_name: {
                          [Op.like]: `%${search.toUpperCase()}%`,
                        },
                      },
                    ],
                  },
                }
              : {}),
          },
          {
            model: ProductVariant,
            as: "productVariant",
            attributes: ["variant_id", "image_url", "price"],
          },
        ],
      },
      {
        model: Order,
        as: "Order",
        attributes: [
          "order_id",
          "user_id",
          "shipping_address_id",
          "total_price",
          "payment_method",
          "status",
          "payment_status",
          "created_at",
          "note",
        ],
        where: orderWhere,
        include: [
          {
            model: User,
            as: "User",
            attributes: ["user_id", "username", "phone", "email"],
            ...(search && !moment(search, "DD/MM/YYYY", true).isValid()
              ? {
                  where: {
                    [Op.or]: [
                      { username: { [Op.like]: `%${search}%` } },
                      { username: { [Op.like]: `%${search.toLowerCase()}%` } },
                      { username: { [Op.like]: `%${search.toUpperCase()}%` } },
                      { phone: { [Op.like]: `%${search}%` } },
                      { email: { [Op.like]: `%${search}%` } },
                    ],
                  },
                }
              : {}),
          },
          {
            model: Address,
            as: "shipping_address",
            attributes: [
              "address_id",
              "recipient_name",
              "phone",
              "address_line",
              "city",
              "district",
              "ward",
            ],
            ...(search && !moment(search, "DD/MM/YYYY", true).isValid()
              ? {
                  where: {
                    [Op.or]: [
                      { phone: { [Op.like]: `%${search}%` } },
                      { recipient_name: { [Op.like]: `%${search}%` } },
                      { address_line: { [Op.like]: `%${search}%` } },
                    ],
                  },
                }
              : {}),
          },
        ],
      },
    ];

    const searchWhere = search
      ? {
          [Op.or]: [
            ...(isNaN(parseInt(search))
              ? []
              : [
                  { sub_order_id: { [Op.eq]: parseInt(search) } },
                  { order_id: { [Op.eq]: parseInt(search) } },
                ]),
          ],
        }
      : {};

    console.log("Executing query with conditions:", {
      subOrderWhere,
      searchWhere,
      include,
    });

    const { count, rows: Orders } = await SubOrder.findAndCountAll({
      where: {
        [Op.and]: [subOrderWhere, searchWhere],
      },
      attributes: ["order_id", "sub_order_id", "status", "shipping_fee"],
      include,
      raw: true,
      nest: true,
      limit,
      offset,
      distinct: true,
    });

    console.log("Query results count:", count);
    console.log(
      "First order product name:",
      Orders[0]?.orderItems?.product?.product_name
    );

    const mergedOrders = Orders.map((item) => ({
      order_id: item.order_id || null,
      sub_order_id: item.sub_order_id || null,
      order_item_id: item.orderItems?.order_item_id || null,
      product_id: item.orderItems?.product?.product_id || null,
      product_name: item.orderItems?.product?.product_name || null,
      discount: item.orderItems?.product?.discount || null,
      variant_id: item.orderItems?.productVariant?.variant_id || null,
      image_url: item.orderItems?.productVariant?.image_url || null,
      price: item.orderItems?.productVariant?.price || null,
      quantity: item.orderItems?.quantity || 1,
      user_id: item.Order?.User?.user_id || null,
      username: item.Order?.User?.username || "Unknown",
      phone: item.Order?.User?.phone || "N/A",
      email: item.Order?.User?.email || "N/A",
      address_id: item.Order?.shipping_address?.address_id || null,
      recipient_name: item.Order?.shipping_address?.recipient_name || "N/A",
      address_phone: item.Order?.shipping_address?.phone || "N/A",
      address_line: item.Order?.shipping_address?.address_line || "N/A",
      city: item.Order?.shipping_address?.city || "N/A",
      district: item.Order?.shipping_address?.district || "N/A",
      ward: item.Order?.shipping_address?.ward || "N/A",
      status: item.status || "N/A",
      payment_status: item.Order?.payment_status || "pending",
      total_price: item.Order?.total_price || "0.00",
      shipping_fee: item.shipping_fee || "0.00",
      payment_method: item.Order?.payment_method || "cod",
      order_date: item.Order?.created_at
        ? moment(item.Order.created_at).tz("Asia/Ho_Chi_Minh").toISOString()
        : new Date().toISOString(),
      note: item.Order?.note || null,
    }));

    const totalItems = count;
    const totalPages = Math.ceil(count / limit);

    console.log("Final results count:", totalItems);

    return {
      success: true,
      message: mergedOrders.length
        ? "Lấy danh sách đơn hàng thành công"
        : "Không có đơn hàng nào",
      data: mergedOrders,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getOrdersWithFilter:", error);
    throw new Error(`Không thể lấy danh sách đơn hàng: ${error.message}`);
  }
};

// Lấy doanh thu tổng
const getRevenue = async (userId) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      raw: true,
    });

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
    const productStats = await ProductVariant.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { shop_id: shop.shop_id },
          attributes: [], // Không lấy gì từ Product
        },
      ],
      attributes: [
        [
          sequelize.fn("COUNT", sequelize.col("Product.product_id")),
          "totalProducts",
        ],
        [sequelize.fn("AVG", sequelize.col("price")), "averagePrice"],
      ],
      raw: true,
    });

    return {
      success: true,
      message: "Lấy thống kê shop thành công",
      data: {
        orderStats,
        productStats: {
          totalProducts: parseInt(productStats[0].totalProducts) || 0,
          averagePrice: parseFloat(productStats[0].averagePrice) || 0,
        },
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

const getShopReviews = async (userId, { page = 1, limit = 10 }) => {
  try {
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    const offset = (page - 1) * limit;

    const reviews = await ShopReview.findAndCountAll({
      where: { shop_id: shop.shop_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
      attributes: ["user_id", "rating", "comment", "created_at"],
    });

    // Lấy danh sách user_id từ các review
    const userIds = reviews.rows.map((review) => review.user_id);

    // Truy vấn bảng Users để lấy username tương ứng
    const users = await User.findAll({
      where: {
        user_id: userIds, // Giả sử cột khóa chính của bảng Users là user_id
      },
      attributes: ["user_id", "username"], // Chỉ lấy user_id và username
    });

    // Tạo một map để ánh xạ user_id sang username
    const userMap = users.reduce((map, user) => {
      map[user.user_id] = user.username;
      return map;
    }, {});

    // Thay user_id bằng username trong kết quả
    const reviewsWithUsername = reviews.rows.map((review) => ({
      username: userMap[review.user_id] || "Unknown", // Nếu không tìm thấy username, trả về "Unknown"
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
    }));

    return {
      success: true,
      message: "Lấy danh sách đánh giá thành công",
      data: {
        reviews: reviewsWithUsername,
        total: reviews.count,
        currentPage: page,
        totalPages: Math.ceil(reviews.count / limit),
      },
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

const getShopRating = async (userId) => {
  try {
    // Tìm shop của vendor
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Lấy tất cả đánh giá của shop
    const reviews = await ShopReview.findAndCountAll({
      where: { shop_id: shop.shop_id },
      attributes: ["rating"],
      raw: true,
    });

    console.log("Found Reviews:", reviews);

    // Tính trung bình rating
    const totalReviews = reviews.count;
    const sumRating = reviews.rows.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      totalReviews > 0 ? parseFloat((sumRating / totalReviews).toFixed(2)) : 0;

    // Trả về kết quả
    const result = {
      averageRating,
      totalReviews,
    };

    return result;
  } catch (error) {
    console.error("Error in getShopRating:", error);
    throw new Error(`Không thể lấy đánh giá shop: ${error.message}`);
  }
};

// Lấy danh sách sản phẩm của shop
const getShopProducts = async (userId) => {
  try {
    console.log("=== Getting Shop Products ===");
    console.log("User ID:", userId);

    // Tìm shop của vendor
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      attributes: ["shop_id", "shop_name"],
      raw: true,
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    console.log("Found Shop:", shop);

    // Lấy danh sách sản phẩm của shop kèm theo giá từ variants
    const products = await Product.findAll({
      where: { shop_id: shop.shop_id },
      include: [
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["image_url", "variant_id", "price"],
        },
        {
          model: Category,
          as: "Category",
          attributes: ["category_id", "category_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      raw: true,
      nest: true,
    });

    console.log(`Found ${products.length} products`);

    // Xử lý dữ liệu trùng lặp và format dữ liệu sản phẩm
    const uniqueProducts = {};

    products.forEach((product) => {
      const productId = product.product_id;

      if (!uniqueProducts[productId]) {
        // Nếu sản phẩm chưa tồn tại, tạo mới
        const variants = Array.isArray(product.variants)
          ? product.variants
          : [product.variants].filter(Boolean);

        // Lấy giá từ variant đầu tiên (hoặc giá thấp nhất nếu có nhiều variants)
        const price = variants.length > 0 ? variants[0].price : 0;

        uniqueProducts[productId] = {
          ...product,
          price: price,
          main_image: variants.length > 0 ? variants[0].image_url : null,
          images: variants.map((img) => ({
            url: img.image_url,
            variant_id: img.variant_id,
            price: img.price,
          })),
          category: product.Category
            ? {
                id: product.Category.category_id,
                name: product.Category.category_name,
              }
            : null,
        };
      } else {
        // Nếu sản phẩm đã tồn tại, thêm variant mới vào mảng images
        const newVariant = product.variants;
        if (newVariant && newVariant.image_url) {
          uniqueProducts[productId].images.push({
            url: newVariant.image_url,
            variant_id: newVariant.variant_id,
            price: newVariant.price,
          });
        }
      }
    });

    return Object.values(uniqueProducts);
  } catch (error) {
    console.error("Error in getShopProducts:", error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (userId, subOrderId, newStatus) => {
  try {
    console.log("Processing in service:", { userId, productId });

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({
      where: { product_id: productId },
    });

    console.log(
      "Found product:",
      product
        ? {
            product_id: product.product_id,
            shop_id: product.shop_id,
            status: product.status,
          }
        : null
    );

    if (!product) {
      throw new Error("Product not found");
    }

    // Kiểm tra user là vendor của sản phẩm thông qua shop_id
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    console.log(
      "Found shop:",
      shop
        ? {
            shop_id: shop.shop_id,
            owner_id: shop.owner_id,
          }
        : null
    );

    if (!shop) {
      throw new Error("Shop not found for this user");
    }

    if (product.shop_id !== shop.shop_id) {
      throw new Error("Unauthorized - You are not the vendor of this product");
    }

    // Tìm tất cả SubOrder có chứa sản phẩm này và đang ở trạng thái pending
    const pendingSubOrders = await SubOrder.findAll({
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          where: {
            product_id: productId,
          },
        },
      ],
      where: {
        shop_id: shop.shop_id,
        status: "pending",
      },
    });

    if (pendingSubOrders.length === 0) {
      throw new Error(
        "Không tìm thấy đơn hàng nào đang chờ xử lý cho sản phẩm này"
      );
    }

    // Cập nhật trạng thái của các SubOrder thành processing
    for (const subOrder of pendingSubOrders) {
      await subOrder.update({
        status: "processing",
        processed_at: new Date(),
      });

      // Cập nhật trạng thái của các OrderItem liên quan
      await OrderItem.update(
        { status: "processing" },
        {
          where: {
            sub_order_id: subOrder.sub_order_id,
            product_id: productId,
          },
        }
      );
    }

    return {
      success: true,
      message: `Đã cập nhật ${pendingSubOrders.length} đơn hàng sang trạng thái processing`,
      processed_orders: pendingSubOrders.map((order) => ({
        sub_order_id: order.sub_order_id,
        status: "processing",
      })),
    };
  } catch (error) {
    console.error("Error in processProduct service:", error);
    throw error;
  }
};

// Process sản phẩm theo product_id
const processProduct = async (userId, productId) => {
  try {
    console.log("Processing in service:", { userId, productId });

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({
      where: { product_id: productId },
    });

    console.log(
      "Found product:",
      product
        ? {
            product_id: product.product_id,
            shop_id: product.shop_id,
            status: product.status,
          }
        : null
    );

    if (!product) {
      throw new Error("Product not found");
    }

    // Kiểm tra user là vendor của sản phẩm thông qua shop_id
    const shop = await Shop.findOne({
      where: { owner_id: userId },
    });

    console.log(
      "Found shop:",
      shop
        ? {
            shop_id: shop.shop_id,
            owner_id: shop.owner_id,
          }
        : null
    );

    if (!shop) {
      throw new Error("Shop not found for this user");
    }

    if (product.shop_id !== shop.shop_id) {
      throw new Error("Unauthorized - You are not the vendor of this product");
    }

    // Tìm tất cả SubOrder có chứa sản phẩm này và đang ở trạng thái pending
    const pendingSubOrders = await SubOrder.findAll({
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          where: {
            product_id: productId,
          },
        },
      ],
      where: {
        shop_id: shop.shop_id,
        status: "pending",
      },
    });

    if (pendingSubOrders.length === 0) {
      throw new Error(
        "Không tìm thấy đơn hàng nào đang chờ xử lý cho sản phẩm này"
      );
    }

    // Cập nhật trạng thái của các SubOrder thành processing
    for (const subOrder of pendingSubOrders) {
      await subOrder.update({
        status: "processing",
        processed_at: new Date(),
      });

      // Cập nhật trạng thái của các OrderItem liên quan
      await OrderItem.update(
        { status: "processing" },
        {
          where: {
            sub_order_id: subOrder.sub_order_id,
            product_id: productId,
          },
        }
      );
    }

    return {
      success: true,
      message: `Đã cập nhật ${pendingSubOrders.length} đơn hàng sang trạng thái processing`,
      processed_orders: pendingSubOrders.map((order) => ({
        sub_order_id: order.sub_order_id,
        status: "processing",
      })),
    };
  } catch (error) {
    console.error("Error in processProduct service:", error);
    throw error;
  }
};

module.exports = {
  getShopByUserId,
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
  updateOrderStatus,
  processProduct,
  getOrdersWithFilter,
};
