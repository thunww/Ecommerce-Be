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
  { status, startDate, endDate, search } = {}
) => {
  try {
    // Decode search term nếu có
    let decodedSearch = search ? decodeURIComponent(search).trim() : null;
    console.log("Decoded search term:", decodedSearch);

    // Tìm shop của user
    const shop = await Shop.findOne({
      where: { owner_id: userId },
      raw: true,
    });

    if (!shop) {
      throw new Error("Không tìm thấy shop");
    }

    // Điều kiện lọc cho SubOrder
    const subOrderWhere = { shop_id: shop.shop_id };
    if (status) {
      subOrderWhere.status = status;
    }

    // Điều kiện lọc chính cho truy vấn
    const mainWhereConditions = [subOrderWhere];
    const orderIncludeWhere = {};
    const orderItemIncludeWhere = {};
    const productIncludeWhere = {};
    const userIncludeWhere = {};
    const addressIncludeWhere = {};

    // Biến cờ để xác định khi nào cần join bắt buộc
    // Ban đầu giả định không bắt buộc, trừ khi logic search/filter yêu cầu
    let requiresOrderItemJoin = false;
    let requiresOrderJoin = false;
    let requiresUserJoin = false;
    let requiresAddressJoin = false;
    let requiresProductJoin = false;

    // Xử lý tham số search
    if (decodedSearch) {
      // 1. Kiểm tra nếu search là ngày (DD/MM/YYYY)
      const formats = ["DD/MM/YYYY"];
      const targetTimezone = "Asia/Ho_Chi_Minh";
      const parsedDate = moment.tz(
        decodedSearch,
        formats,
        targetTimezone,
        true
      );

      if (parsedDate.isValid()) {
        // Nếu là ngày, lọc theo ngày tạo đơn hàng
        orderIncludeWhere.created_at = {
          [Op.between]: [
            parsedDate.startOf("day").utc().toDate(),
            parsedDate.endOf("day").utc().toDate(),
          ],
        };
        requiresOrderJoin = true; // Cần join Order để lọc theo created_at
      } else if (
        !isNaN(parseInt(decodedSearch)) &&
        String(parseInt(decodedSearch)) === decodedSearch
      ) {
        // 2. Kiểm tra nếu search là số nguyên (tìm theo order_item_id)
        const orderItemId = parseInt(decodedSearch);
        orderItemIncludeWhere.order_item_id = orderItemId;
        requiresOrderItemJoin = true; // Cần join OrderItem để lọc theo ID
        requiresProductJoin = true; // Cần join Product (thông qua OrderItem)
        requiresOrderJoin = true; // Cần join Order
        requiresUserJoin = true; // Cần join User
        requiresAddressJoin = true; // Cần join Address
      } else {
        // 3. Nếu không phải ngày và không phải số nguyên, tìm kiếm theo chuỗi
        const searchString = decodedSearch.toLowerCase();
        const stringSearchConditions = [];

        // Tìm kiếm theo tên sản phẩm (cần join OrderItem và Product)
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn(
              "LOWER",
              Sequelize.col("orderItems.product.product_name") // Sử dụng alias.column
            ),
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );

        // Tìm kiếm theo tên người dùng (cần join Order và User)
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("Order.User.username")), // Sử dụng alias.column
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );

        // Tìm kiếm theo số điện thoại người dùng (cần join Order và User)
        stringSearchConditions.push({
          "$Order.User.phone$": { [Op.like]: `%${decodedSearch}%` },
        });

        // Tìm kiếm theo tên người nhận (cần join Order và Address)
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn(
              "LOWER",
              Sequelize.col("Order.shipping_address.recipient_name") // Sử dụng alias.column
            ),
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );

        // Tìm kiếm theo số điện thoại người nhận (cần join Order và Address)
        stringSearchConditions.push({
          "$Order.shipping_address.phone$": { [Op.like]: `%${decodedSearch}%` },
        });

        // Tìm kiếm theo địa chỉ (address_line, city, district, ward)
        // Cần join Order và Address
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn(
              "LOWER",
              Sequelize.col("Order.shipping_address.address_line")
            ),
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("Order.shipping_address.city")),
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn(
              "LOWER",
              Sequelize.col("Order.shipping_address.district")
            ),
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );
        stringSearchConditions.push(
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("Order.shipping_address.ward")),
            {
              [Op.like]: `%${searchString}%`,
            }
          )
        );

        // Thêm điều kiện tìm kiếm chuỗi vào mainWhereConditions
        mainWhereConditions.push({ [Op.or]: stringSearchConditions });

        // Yêu cầu join các bảng liên quan khi tìm kiếm chuỗi
        requiresOrderItemJoin = true; // Để search product_name trong OrderItem include
        requiresProductJoin = true; // Để search product_name
        requiresOrderJoin = true; // Để search Order, User, Address fields
        requiresUserJoin = true; // Để search User fields
        requiresAddressJoin = true; // Để search Address fields
      }
    }

    // Xử lý startDate và endDate (chỉ khi search không phải là ngày)
    if (!orderIncludeWhere.created_at && startDate && endDate) {
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
      orderIncludeWhere.created_at = {
        [Op.between]: [start, end],
      };
      requiresOrderJoin = true; // Cần join Order để lọc theo created_at
    }

    // Cấu hình include cho truy vấn
    // Loại bỏ .filter() để luôn bao gồm các join được định nghĩa,
    // trừ khi 'required' được đặt động dựa trên điều kiện search.
    // Chúng ta sẽ đặt 'required: true' cho các join luôn cần thiết.
    const includeConfig = [
      {
        model: OrderItem,
        as: "orderItems",
        attributes: ["order_item_id", "quantity"],
        // Áp dụng điều kiện OrderItem ID search ở đây
        where: orderItemIncludeWhere,
        // Required: true nếu cần lọc theo OrderItem ID hoặc search chuỗi liên quan OrderItem
        // Nếu không, Sequelize sẽ dùng LEFT JOIN theo mặc định (required: false)
        required: requiresOrderItemJoin,
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["product_id", "product_name", "discount"],
            // Áp dụng điều kiện Product name search ở đây
            where: productIncludeWhere,
            // Required: true nếu cần lọc theo Product name hoặc search chuỗi liên quan Product
            required: requiresProductJoin,
          },
          {
            model: ProductVariant,
            as: "productVariant",
            attributes: ["variant_id", "image_url", "price"],
            // ProductVariant thường đi cùng OrderItem, có thể required nếu OrderItem required
            required: requiresOrderItemJoin, // Hoặc true nếu luôn cần variant info khi có OrderItem
          },
        ],
      },
      {
        model: Order,
        as: "Order", // Giữ alias "Order" để khớp với mapping
        attributes: [
          "order_id",
          "user_id",
          "shipping_address_id",
          "total_price", // Order total_price
          "payment_method",
          // "status", // Trạng thái đã có ở SubOrder, có thể bỏ hoặc giữ nếu cần phân biệt
          "payment_status",
          "created_at", // Order created_at
          "note",
        ],
        // Áp dụng điều kiện Date search ở đây
        where: orderIncludeWhere,
        required: true, // <-- Đảm bảo join Order luôn xảy ra
        include: [
          {
            model: User,
            as: "User", // Giữ alias "User" để khớp với mapping
            attributes: ["user_id", "username", "phone", "email"],
            // Áp dụng điều kiện User search ở đây
            where: userIncludeWhere,
            required: true, // <-- Đảm bảo join User luôn xảy ra (vì mỗi Order có User)
          },
          {
            model: Address,
            as: "shipping_address", // Giữ alias "shipping_address" để khớp với mapping
            attributes: [
              "address_id",
              "recipient_name",
              "phone",
              "address_line",
              "city",
              "district",
              "ward",
            ],
            // Áp dụng điều kiện Address search ở đây
            where: addressIncludeWhere,
            required: true, // <-- Đảm bảo join Address luôn xảy ra (vì mỗi Order có Address)
          },
        ],
      },
    ];

    // Truy vấn tất cả SubOrder phù hợp
    const Orders = await SubOrder.findAll({
      where: { [Op.and]: mainWhereConditions }, // Gộp tất cả điều kiện chính
      attributes: [
        // Chọn các thuộc tính trực tiếp của SubOrder
        "order_id",
        "sub_order_id",
        "status", // Trạng thái của SubOrder
        "total_price", // Total price của SubOrder
        "shipping_fee",
        "created_at", // Created at của SubOrder
      ],
      // Sử dụng includeConfig trực tiếp, không filter()
      include: includeConfig,
      order: [
        // Sắp xếp theo created_at của SubOrder
        ["created_at", "DESC"],
        // Bỏ dòng sắp xếp theo orderItems.order_item_id để tránh lỗi
        // ["orderItems", "order_item_id", "ASC"], // Đã bỏ
      ],
      raw: true,
      nest: true,
      // distinct: true, // Bỏ distinct nếu một SubOrder có nhiều OrderItem và bạn muốn mỗi cặp SubOrder-OrderItem là một hàng
    });

    console.log("Total raw orders found:", Orders.length);

    // Dữ liệu đã được join và nest, giờ map lại cấu trúc mong muốn
    // Cần cẩn thận với các trường có thể null nếu OrderItem không được join (khi required: false)
    const formattedOrders = Orders.map((item) => ({
      order_id: item.order_id || null,
      sub_order_id: item.sub_order_id || null,
      // Truy cập dữ liệu từ OrderItem (có thể null nếu OrderItem không được join)
      order_item_id: item.orderItems?.order_item_id || null,
      // Truy cập dữ liệu từ Product (thông qua OrderItem, có thể null)
      product_id: item.orderItems?.product?.product_id || null,
      product_name: item.orderItems?.product?.product_name || null,
      discount: item.orderItems?.product?.discount || null,
      // Truy cập dữ liệu từ ProductVariant (thông qua OrderItem, có thể null)
      variant_id: item.orderItems?.productVariant?.variant_id || null,
      image_url: item.orderItems?.productVariant?.image_url || null,
      price: item.orderItems?.productVariant?.price || null, // Giá variant
      quantity: item.orderItems?.quantity || null, // Số lượng trong OrderItem

      // Tính giá item nếu có đủ dữ liệu
      item_total_price:
        item.orderItems?.productVariant?.price != null &&
        item.orderItems?.quantity != null &&
        item.orderItems?.product?.discount != null
          ? parseFloat(item.orderItems.productVariant.price) *
            parseInt(item.orderItems.quantity, 10) *
            (1 - (parseFloat(item.orderItems.product.discount) || 0) / 100)
          : 0, // Hoặc null, tùy logic

      // Truy cập dữ liệu từ Order
      // required: true cho Order nên Order.User, Order.shipping_address sẽ tồn tại nếu item.Order tồn tại
      user_id: item.Order?.user_id || null,
      username: item.Order?.User?.username || "Unknown",
      phone: item.Order?.User?.phone || null,
      email: item.Order?.User?.email || null,

      // Truy cập dữ liệu từ Address (thông qua Order)
      recipient_name: item.Order?.shipping_address?.recipient_name || "N/A",
      address_phone: item.Order?.shipping_address?.phone || "N/A",
      address_line: item.Order?.shipping_address?.address_line || "N/A",
      city: item.Order?.shipping_address?.city || "N/A",
      district: item.Order?.shipping_address?.district || "N/A",
      ward: item.Order?.shipping_address?.ward || "N/A",

      // Dữ liệu trực tiếp từ SubOrder
      status: item.status || "N/A", // Trạng thái từ SubOrder
      order_total_price: item.total_price || "0.00", // Total price từ SubOrder
      shipping_fee: item.shipping_fee || "0.00", // Shipping fee từ SubOrder

      // Dữ liệu từ Order
      payment_status: item.Order?.payment_status || "pending",
      payment_method: item.Order?.payment_method || "cod",
      order_date: item.Order?.created_at
        ? moment(item.Order.created_at)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss")
        : "", // Ngày tạo Order
      note: item.Order?.note || null,
    }));

    // Nếu một SubOrder có nhiều OrderItem, kết quả raw/nest có thể trả về nhiều hàng
    // cho cùng một SubOrder. Cần nhóm lại nếu bạn muốn mỗi SubOrder là một đối tượng
    // duy nhất với một mảng OrderItems bên trong.
    // Tuy nhiên, với cấu trúc mapping hiện tại, nó đang giả định mỗi hàng raw
    // tương ứng với một OrderItem của SubOrder. Nếu raw: true, nest: true hoạt động
    // như bạn mong đợi (mỗi hàng là một SubOrder với OrderItems lồng vào), thì mapping
    // cần được điều chỉnh để xử lý mảng OrderItems.

    console.log(`Found ${formattedOrders.length} formatted items.`);
    // Log cấu trúc của một item đầu tiên để kiểm tra

    return {
      success: true,
      message: Orders.length // Dựa vào số lượng hàng raw tìm được
        ? "Lấy danh sách đơn hàng thành công"
        : "Không có đơn hàng nào",
      // Trả về dữ liệu đã định dạng
      data: formattedOrders,
      // Có thể cần thêm thông tin phân trang nếu bạn có limit/offset trong truy vấn
      // totalItems: ...,
      // totalPages: ...,
      // currentPage: ...
    };
  } catch (error) {
    console.error("Error in getOrdersWithFilter:", error);
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

// Service function to update multiple suborders status to 'processing'
const updateSubordersStatusToProcessing = async (subOrderIds) => {
  try {
    if (!Array.isArray(subOrderIds) || subOrderIds.length === 0) {
      // Handle case where input is not an array or is empty
      console.warn(
        "Invalid or empty subOrderIds array provided to updateSubordersStatusToProcessing"
      );
      return { success: false, message: "Invalid or empty subOrderIds list" };
    }

    // Update the status of SubOrders where the sub_order_id is in the provided list
    const [affectedRowsCount] = await SubOrder.update(
      { status: "processing" },
      {
        where: {
          sub_order_id: subOrderIds,
        },
      }
    );

    if (affectedRowsCount > 0) {
      console.log(
        `Successfully updated status to 'processing' for ${affectedRowsCount} suborders.`
      );
      return { success: true, affectedCount: affectedRowsCount };
    } else {
      console.warn(`No suborders found with provided IDs to update status.`);
      return { success: false, message: "No matching suborders found" };
    }
  } catch (error) {
    console.error("Error in updateSubordersStatusToProcessing service:", error);
    throw new Error("Failed to update suborder status");
  }
};

// Service function to delete multiple suborders by their IDs
const deleteSubordersByIds = async (subOrderIds) => {
  try {
    if (!Array.isArray(subOrderIds) || subOrderIds.length === 0) {
      console.warn(
        "Invalid or empty subOrderIds array provided to deleteSubordersByIds"
      );
      return { success: false, message: "Invalid or empty subOrderIds list" };
    }

    // Delete SubOrders where the sub_order_id is in the provided list
    const deletedRowsCount = await SubOrder.destroy({
      where: {
        sub_order_id: subOrderIds,
      },
    });

    if (deletedRowsCount > 0) {
      console.log(`Successfully deleted ${deletedRowsCount} suborders.`);
      return { success: true, deletedCount: deletedRowsCount };
    } else {
      console.warn(`No suborders found with provided IDs to delete.`);
      return { success: false, message: "No matching suborders found" };
    }
  } catch (error) {
    console.error("Error in deleteSubordersByIds service:", error);
    throw new Error("Failed to delete suborders");
  }
};

// Service function to get order data for export based on filters
const getOrdersForExport = async (userId, filters) => {
  try {
    const shop = await Shop.findOne({ where: { owner_id: userId } });
    if (!shop) {
      throw new Error("Không tìm thấy thông tin shop");
    }

    const whereClause = {
      shop_id: shop.shop_id,
    };

    if (filters.status) {
      whereClause.status = filters.status;
    }

    const includeConditions = [
      {
        model: OrderItem,
        as: "orderItems",
        
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["product_name", "discount"],
            required: true,
          },
          {
            model: ProductVariant,
            as: "productVariant",
            attributes: ["size", "color", "price"],
            required: true,
          },
        ],
        required: true,
      },
      {
        model: Order,
        as: "Order",
        required: true,
        where: {},
        attributes: ["created_at"],
        include: [
          {
            model: User,
            as: "User",
            attributes: ["username", "email", "phone"],
            required: true,
          },
          {
            model: Address,
            as: "shipping_address",
            attributes: [
              "recipient_name",
              "phone",
              "address_line",
              "city",
              "district",
              "ward",
            ],
            required: true,
          },
        ],
      },
    ];

    // Xử lý ngày tháng
    if (filters.startDate || filters.endDate) {
      includeConditions[1].where.created_at = {};

      if (filters.startDate) {
        const startDate = moment(filters.startDate)
          .startOf("day")
          .utc()
          .toDate();
        includeConditions[1].where.created_at[Op.gte] = startDate;
        console.log("Start date:", startDate);
      }

      if (filters.endDate) {
        const endDate = moment(filters.endDate).endOf("day").utc().toDate();
        includeConditions[1].where.created_at[Op.lte] = endDate;
        console.log("End date:", endDate);
      }
    }

    // Xử lý search
    if (filters.search) {
      const decodedSearch = decodeURIComponent(filters.search).trim();
      console.log("Search term:", decodedSearch);

      // Kiểm tra nếu search là số (order_item_id)
      if (!isNaN(decodedSearch)) {
        includeConditions[0].where = {
          order_item_id: parseInt(decodedSearch),
        };
      } else {
        // Nếu không phải số, tìm theo tên sản phẩm
        includeConditions[0].include[0].where = {
          product_name: {
            [Op.like]: `%${decodedSearch}%`,
          },
        };
      }
    }

    console.log("Where clause:", JSON.stringify(whereClause, null, 2));
    console.log(
      "Order where clause:",
      JSON.stringify(includeConditions[1].where, null, 2)
    );
    console.log(
      "OrderItem where clause:",
      JSON.stringify(includeConditions[0].where, null, 2)
    );

    const orders = await SubOrder.findAll({
      where: whereClause,
      include: includeConditions,
      order: [[{ model: Order, as: "Order" }, "created_at", "DESC"]],
    });

    console.log("Found orders count:", orders.length);

    return orders.map((order) => ({
      ...order.toJSON(),
      orderItems: order.orderItems.map((item) => ({
        ...item.toJSON(),
        product_name: item.product.product_name,
        discount: item.product.discount,
        size: item.productVariant.size,
        color: item.productVariant.color,
        price: item.productVariant.price,
        item_total:
          item.productVariant.price *
          item.quantity *
          (1 - item.product.discount / 100),
      })),
      customer: order.Order.User,
      shipping_address: order.Order.shipping_address,
      created_at: order.Order.created_at,
    }));
  } catch (error) {
    console.error("Error in getOrdersForExport:", error);
    throw new Error(`Không thể lấy dữ liệu đơn hàng để xuất: ${error.message}`);
  }
};

// Service function to get suborders with order items paginated

const getSubordersWithOrderItemsPaginated = async (
  userId,
  { page = 1, limit = 10, status, startDate, endDate, search }
) => {
  try {
    const offset = (page - 1) * limit;

    const shop = await Shop.findOne({
      where: { owner_id: userId },
      attributes: ["shop_id"],
      raw: true,
    });

    if (!shop) throw new Error("Không tìm thấy shop");

    const whereCondition = {
      shop_id: shop.shop_id,
    };

    if (status) {
      whereCondition.status = status;
    }

    const orderWhereCondition = {};

    if (startDate) {
      orderWhereCondition.created_at = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      orderWhereCondition.created_at = {
        ...(orderWhereCondition.created_at || {}),
        [Op.lte]: end,
      };
    }

    // Xác định kiểu search
    const trimmedSearch = search ? search.trim() : null;
    const isNumericSearch = trimmedSearch && /^[0-9]+$/.test(trimmedSearch);
    const isOrderItemIdSearch = isNumericSearch; // Giả sử order_item_id là số nguyên, cùng định dạng với số điện thoại (để rõ ràng bạn có thể bổ sung thêm check riêng nếu muốn)

    // Các điều kiện include
    let orderItemWhere = undefined;
    let productWhere = undefined;
    let orderWhereExtra = {};

    if (trimmedSearch) {
      if (isNumericSearch) {
        // Tìm theo order_item_id hoặc số điện thoại
        // Giờ phân biệt xem search là order_item_id hay số điện thoại
        // Để phân biệt, bạn có thể test xem có tồn tại order_item_id nào trùng với giá trị search không
        // Nếu có thì ưu tiên trả về theo order_item_id, nếu không thì mới tìm số điện thoại
        // Nhưng trong truy vấn 1 lần khó làm, bạn có thể ưu tiên tìm theo order_item_id trước

        // Giả sử ưu tiên tìm order_item_id
        orderItemWhere = {
          order_item_id: Number(trimmedSearch),
        };

        // Nếu muốn fallback tìm theo số điện thoại khi không tìm được order_item_id, cần 2 truy vấn hoặc logic phức tạp hơn
        // Ở đây mình chỉ làm 1 truy vấn ưu tiên order_item_id
      } else {
        // search chữ -> tìm theo product_name
        productWhere = {
          product_name: {
            [Op.like]: `%${trimmedSearch}%`,
          },
        };
      }
    }

    // Nếu tìm theo số điện thoại: bắt buộc check thêm số điện thoại trong shipping_address.phone
    if (trimmedSearch && isNumericSearch && !orderItemWhere) {
      // Trường hợp không phải order_item_id thì filter số điện thoại
      orderWhereExtra["$Order.shipping_address.phone$"] = trimmedSearch;
    }

    const result = await SubOrder.findAll({
      where: whereCondition,
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          required: !!search, // Bắt buộc có orderItems khi search
          where: orderItemWhere,
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name", "discount"],
              where: productWhere,
              required: !!productWhere,
            },
            {
              model: ProductVariant,
              as: "productVariant",
              attributes: ["image_url", "price", "size", "color"],
            },
          ],
        },
        {
          model: Order,
          as: "Order",
          attributes: [
            "created_at",
            "note",
            "total_price",
            "payment_method",
            "payment_status",
            "user_id",
          ],
          required:
            Object.keys(orderWhereCondition).length > 0 ||
            Object.keys(orderWhereExtra).length > 0,
          where: {
            ...orderWhereCondition,
            ...orderWhereExtra,
          },
          include: [
            {
              model: User,
              as: "User",
              attributes: ["username", "phone", "email"],
              required: false,
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
            },
          ],
        },
      ],
      order: [[{ model: Order, as: "Order" }, "created_at", "DESC"]],
      nest: true,
      raw: true,
    });

    const subordersMap = new Map();

    result.forEach((row) => {
      const suborderId = row.sub_order_id;
      if (!subordersMap.has(suborderId)) {
        subordersMap.set(suborderId, {
          sub_order_id: row.sub_order_id,
          order_id: row.order_id,
          shop_id: row.shop_id,
          status: row.status,
          shipping_fee: row.shipping_fee,
          created_at: row.Order?.created_at,
          recipient_name: row.Order?.shipping_address?.recipient_name || "N/A",
          address_phone: row.Order?.shipping_address?.phone || "N/A",
          address_line: row.Order?.shipping_address?.address_line || "N/A",
          city: row.Order?.shipping_address?.city || "N/A",
          district: row.Order?.shipping_address?.district || "N/A",
          ward: row.Order?.shipping_address?.ward || "N/A",
          note: row.Order?.note || null,
          payment_method: row.Order?.payment_method,
          payment_status: row.Order?.payment_status,
          username: row.Order?.User?.username || "N/A",
          user_email: row.Order?.User?.email || "N/A",
          user_phone: row.Order?.User?.phone || "N/A",
          user_id: row.Order?.user_id,
          orderItems: [],
        });
      }

      if (row.orderItems?.order_item_id) {
        subordersMap.get(suborderId).orderItems.push({
          order_item_id: row.orderItems.order_item_id,
          product_id: row.orderItems.product_id,
          variant_id: row.orderItems.variant_id,
          quantity: row.orderItems.quantity,
          product_name: row.orderItems.product?.product_name,
          product_discount: row.orderItems.product?.discount,
          variant_image: row.orderItems.productVariant?.image_url,
          variant_price: row.orderItems.productVariant?.price,
          variant_size: row.orderItems.productVariant?.size,
          variant_color: row.orderItems.productVariant?.color,
        });
      }
    });

    const formattedSuborders = Array.from(subordersMap.values());
    const paginatedSuborders = formattedSuborders.slice(offset, offset + limit);

    return {
      success: true,
      message:
        paginatedSuborders.length > 0
          ? "Lấy danh sách suborders thành công"
          : "Không có suborder nào",
      data: paginatedSuborders,
      total: formattedSuborders.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(formattedSuborders.length / limit),
    };
  } catch (error) {
    console.error("Lỗi trong getSubordersWithOrderItemsPaginated:", error);
    throw new Error(`Không thể lấy danh sách suborders: ${error.message}`);
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
  updateSubordersStatusToProcessing,
  deleteSubordersByIds,
  getOrdersForExport,
  getSubordersWithOrderItemsPaginated,
};
