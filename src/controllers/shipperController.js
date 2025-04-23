const {
  Shipper,
  User,
  Order,
  Shipment,
  Address,
  Payment,
  SubOrder,
  sequelize,
  OrderItem,
  Product,
  ProductVariant,
} = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns");
const { validationResult } = require("express-validator");
const { upload } = require("../middleware/upload");

// Helper function for error handling
const handleError = (res, error, message = "Lỗi server") => {
  console.error("Error:", error);
  return res.status(500).json({ success: false, message });
};

// Helper function for request validation
const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    };
  }
  return null;
};

// Đăng ký shipper
exports.registerShipper = async (req, res) => {
  try {
    const validationError = validateRequest(req);
    if (validationError) return res.status(400).json(validationError);

    const { vehicle_type, license_plate, phone } = req.body;
    const userId = req.user.user_id;

    // Kiểm tra xem user đã đăng ký shipper chưa
    const existingShipper = await Shipper.findOne({
      where: { user_id: userId },
    });
    if (existingShipper) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký làm shipper",
      });
    }

    // Tạo shipper mới
    const shipper = await Shipper.create({
      user_id: userId,
      vehicle_type,
      license_plate,
      phone,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký shipper thành công",
      data: shipper,
    });
  } catch (error) {
    handleError(res, error, "Đăng ký shipper thất bại");
  }
};

// Lấy thông tin shipper
exports.getShipperProfile = async (req, res) => {
  try {
    console.log("User from request:", req.user);

    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found",
      });
    }

    const userId = req.user.user_id;
    console.log("Getting profile for userId:", userId);

    // Lấy thông tin shipper
    // Lấy thông tin shipper
    const shipper = await Shipper.findOne({
      where: { user_id: userId },
    });

    console.log("Found shipper:", shipper ? shipper.toJSON() : null);

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Lấy thông tin user
    const user = await User.findByPk(userId, {
      attributes: [
        "user_id",
        "first_name",
        "last_name",
        "email",
        "profile_picture",
      ],
    });

    console.log("Found user:", user ? user.toJSON() : null);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin user",
      });
    }

    // Kết hợp thông tin
    const shipperData = shipper.toJSON();
    shipperData.user = user.toJSON();

    console.log("Final response data:", shipperData);

    res.json({
      success: true,
      data: shipperData,
    });
  } catch (error) {
    console.error("Detailed error in getShipperProfile:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res.status(500).json({
      success: false,
      message: "Lấy thông tin shipper thất bại",
      error: error.message,
    });
  }
};

// Cập nhật thông tin shipper
exports.updateShipperProfile = async (req, res) => {
  try {
    const validationError = validateRequest(req);
    if (validationError) return res.status(400).json(validationError);

    const userId = req.user.user_id;
    const { vehicle_type, license_plate } = req.body;

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    await shipper.update({
      vehicle_type,
      license_plate,
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: shipper,
    });
  } catch (error) {
    handleError(res, error, "Cập nhật thông tin thất bại");
  }
};

// Cập nhật avatar shipper
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ảnh đại diện",
      });
    }

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    shipper.avatar = req.file.path;
    await shipper.save();

    res.json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công",
      data: shipper,
    });
  } catch (error) {
    handleError(res, error, "Cập nhật ảnh đại diện thất bại");
  }
};

// Lấy danh sách sub_orders
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const shipper = await Shipper.findOne({
      where: { user_id: userId },
      attributes: ["shipper_id"],
    });

    if (!shipper) {
      console.log("Shipper not found for user:", userId);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    console.log("Found shipper:", shipper.toJSON());

    const subOrders = await SubOrder.findAll({
      where: {
        [Op.or]: [
          {
            status: "processing",
            "$shipment.shipper_id$": null,
          },
          {
            [Op.and]: [
              {
                status: {
                  [Op.in]: ["shipped", "delivered"],
                },
              },
              {
                "$shipment.shipper_id$": shipper.shipper_id,
              },
            ],
          },
          {
            [Op.and]: [
              {
                status: "cancelled",
              },
              {
                "$shipment.shipper_id$": shipper.shipper_id,
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          required: false,
          attributes: [
            "status",
            "created_at",
            "updated_at",
            "estimated_delivery_date",
            "shipper_id",
          ],
        },
        {
          model: Order,
          attributes: [
            "order_id",
            "user_id",
            "total_price",
            "status",
            "payment_status",
            "note",
          ],
          include: [
            {
              model: Address,
              as: "shipping_address",
              attributes: ["address_line", "city"],
            },
            {
              model: User,
              attributes: [
                "user_id",
                "first_name",
                "last_name",
                "email",
                "phone",
                "profile_picture",
              ],
            },
          ],
        },
      ],
      attributes: [
        "sub_order_id",
        "order_id",
        "status",
        "total_price",
        "shipping_fee",
        "created_at",
        "updated_at",
      ],
      order: [["created_at", "DESC"]],
    });

    console.log("Found subOrders:", subOrders.length);
    console.log(
      "Order statuses:",
      subOrders.map((order) => ({
        id: order.sub_order_id,
        status: order.status,
        shipper_id: order.shipment?.shipper_id,
      }))
    );

    // Set headers to prevent caching
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.json({
      success: true,
      data: subOrders,
    });
  } catch (error) {
    console.error("Error in getOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Lấy danh sách sub_orders thất bại",
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
    });
  }
};

// Lấy chi tiết sub_order
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.user_id;
    console.log("Getting order details for:", { orderId, userId });

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    console.log("Found shipper:", shipper ? shipper.toJSON() : null);

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Lấy thông tin sub_order
    const subOrder = await SubOrder.findOne({
      where: {
        sub_order_id: orderId,
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          attributes: [
            "status",
            "created_at",
            "updated_at",
            "estimated_delivery_date",
          ],
        },
        {
          model: Order,
          attributes: [
            "order_id",
            "user_id",
            "total_price",
            "status",
            "payment_status",
            "note",
          ],
          include: [
            {
              model: Address,
              as: "shipping_address",
              attributes: ["address_line", "city"],
            },
            {
              model: User,
              attributes: [
                "user_id",
                "first_name",
                "last_name",
                "email",
                "phone",
                "profile_picture",
              ],
            },
          ],
        },
      ],
    });

    console.log("Found subOrder:", subOrder ? subOrder.toJSON() : null);

    if (!subOrder) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Lấy thông tin order items riêng
    console.log("Fetching order items for sub_order_id:", orderId);
    const orderItems = await OrderItem.findAll({
      where: { sub_order_id: orderId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "product_id",
            "product_name",
            "description",
            "weight",
            "dimensions",
          ],
        },
        {
          model: ProductVariant,
          as: "productVariant",
          attributes: [
            "variant_id",
            "size",
            "color",
            "material",
            "storage",
            "ram",
            "processor",
            "weight",
            "price",
            "stock",
            "image_url",
          ],
        },
      ],
    });

    console.log("Found order items:", orderItems ? orderItems.length : 0);

    // Thêm order items vào subOrder
    subOrder.dataValues.orderItems = orderItems;

    res.json({
      success: true,
      message: "Lấy chi tiết đơn hàng thành công",
      data: subOrder,
    });
  } catch (error) {
    console.error("Error in getOrderDetails:", error);
    handleError(res, error, "Lấy chi tiết đơn hàng thất bại");
  }
};

// Nhận đơn hàng
exports.acceptOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log("Accept order request params:", req.params);
    console.log("Accept order request body:", req.body);

    const { orderId } = req.params;
    const subOrderId = parseInt(orderId);

    if (!orderId || isNaN(subOrderId)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Sub_order ID không hợp lệ",
      });
    }

    const userId = req.user.user_id;
    console.log(
      "Processing request - subOrderId:",
      subOrderId,
      "userId:",
      userId
    );

    // Kiểm tra shipper
    const shipper = await Shipper.findOne({
      where: { user_id: userId },
      attributes: ["shipper_id", "status"],
      transaction: t,
    });
    console.log("Found shipper:", shipper ? shipper.toJSON() : null);

    if (!shipper) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    if (shipper.status !== "active") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Tài khoản shipper không hoạt động",
      });
    }

    // Kiểm tra sub_order
    console.log("Finding sub_order with ID:", subOrderId);
    const subOrder = await SubOrder.findOne({
      where: {
        sub_order_id: subOrderId,
        status: "processing",
      },
      attributes: ["sub_order_id", "status", "total_price", "shipping_fee"],
      transaction: t,
      lock: true,
    });
    console.log("Found sub_order:", subOrder ? subOrder.toJSON() : null);

    if (!subOrder) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy đơn hàng hoặc đơn hàng không ở trạng thái processing",
      });
    }

    // Cập nhật trạng thái sub_order
    console.log("Updating sub_order status to shipped");
    await subOrder.update(
      {
        status: "shipped",
      },
      { transaction: t }
    );

    // Tạo hoặc cập nhật shipment
    console.log("Finding existing shipment");
    const shipment = await Shipment.findOne({
      where: { sub_order_id: subOrderId },
      attributes: [
        "shipment_id",
        "sub_order_id",
        "shipper_id",
        "status",
        "tracking_number",
        "estimated_delivery_date",
      ],
      transaction: t,
    });
    console.log("Existing shipment:", shipment ? shipment.toJSON() : null);

    let updatedShipment;
    if (shipment) {
      console.log("Updating existing shipment");
      updatedShipment = await shipment.update(
        {
          status: "in_transit",
          estimated_delivery_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          transaction: t,
          fields: ["status", "estimated_delivery_date"],
        }
      );
    } else {
      console.log("Creating new shipment");
      updatedShipment = await Shipment.create(
        {
          sub_order_id: subOrderId,
          shipper_id: shipper.shipper_id,
          status: "in_transit",
          tracking_number: "TN" + Date.now(),
          estimated_delivery_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          transaction: t,
          fields: [
            "sub_order_id",
            "shipper_id",
            "status",
            "tracking_number",
            "estimated_delivery_date",
          ],
        }
      );
    }

    // Commit transaction nếu mọi thứ OK
    await t.commit();

    // Trả về kết quả
    console.log("Operation completed successfully");
    res.json({
      success: true,
      message: "Nhận đơn hàng thành công",
      data: {
        subOrder: subOrder.toJSON(),
        shipment: updatedShipment.toJSON(),
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await t.rollback();

    console.error("Detailed error in acceptOrder:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res.status(500).json({
      success: false,
      message: "Lỗi khi nhận đơn hàng",
      error: {
        message: error.message,
        name: error.name,
      },
    });
  }
};

// Hoàn thành đơn hàng
exports.completeOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { orderId } = req.params;
    const userId = req.user.user_id;

    console.log(
      "Complete order request - orderId:",
      orderId,
      "userId:",
      userId
    );

    const shipper = await Shipper.findOne({
      where: { user_id: userId },
      attributes: ["shipper_id", "status"],
      transaction: t,
    });

    console.log("Found shipper:", shipper ? shipper.toJSON() : null);

    if (!shipper) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Kiểm tra sub_order
    console.log("Finding sub_order with ID:", orderId);
    const subOrder = await SubOrder.findOne({
      where: {
        sub_order_id: orderId,
        status: "shipped",
      },
      attributes: ["sub_order_id", "status", "total_price", "shipping_fee"],
      transaction: t,
      lock: true,
    });

    console.log("Found sub_order:", subOrder ? subOrder.toJSON() : null);

    if (!subOrder) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc đơn hàng không thể hoàn thành",
      });
    }

    // Cập nhật trạng thái sub_order
    console.log("Updating sub_order status to delivered");
    await subOrder.update(
      {
        status: "delivered",
      },
      {
        transaction: t,
        fields: ["status"],
      }
    );

    // Cập nhật hoặc tạo mới shipment
    console.log("Finding shipment");
    let shipment = await Shipment.findOne({
      where: {
        sub_order_id: subOrder.sub_order_id,
      },
      attributes: [
        "shipment_id",
        "status",
        "actual_delivery_date",
        "shipper_id",
      ],
      transaction: t,
    });

    console.log("Found shipment:", shipment ? shipment.toJSON() : null);

    if (!shipment) {
      console.log("Creating new shipment");
      // Nếu không tìm thấy shipment, tạo mới
      shipment = await Shipment.create(
        {
          sub_order_id: subOrder.sub_order_id,
          shipper_id: shipper.shipper_id,
          status: "delivered",
          tracking_number: "TN" + Date.now(),
          actual_delivery_date: new Date(),
          estimated_delivery_date: new Date(),
        },
        {
          transaction: t,
          fields: [
            "sub_order_id",
            "shipper_id",
            "status",
            "tracking_number",
            "actual_delivery_date",
            "estimated_delivery_date",
          ],
        }
      );
    } else {
      console.log("Updating existing shipment");
      // Kiểm tra xem shipment có thuộc về shipper hiện tại không
      if (shipment.shipper_id !== shipper.shipper_id) {
        await t.rollback();
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền cập nhật đơn hàng này",
        });
      }

      await shipment.update(
        {
          status: "delivered",
          actual_delivery_date: new Date(),
        },
        {
          transaction: t,
          fields: ["status", "actual_delivery_date"],
        }
      );
    }

    await t.commit();

    // Trả về kết quả
    console.log("Operation completed successfully");
    res.json({
      success: true,
      message: "Hoàn thành đơn hàng thành công",
      data: {
        subOrder: subOrder.toJSON(),
        shipment: shipment.toJSON(),
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await t.rollback();

    console.error("Detailed error in completeOrder:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message: "Hoàn thành đơn hàng thất bại",
      error: {
        message: error.message,
        name: error.name,
      },
    });
  }
};

// Lấy thống kê thu nhập
exports.getIncomeStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { startDate, endDate } = req.query;

    const shipper = await Shipper.findOne({ where: { user_id: userId } });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Convert dates to UTC
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const completedSubOrders = await SubOrder.findAll({
      where: {
        status: "delivered",
        updated_at: {
          [Op.between]: [startDateTime, endDateTime],
        },
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          where: {
            shipper_id: shipper.shipper_id,
          },
          required: true,
        },
      ],
    });

    // Calculate statistics
    const totalIncome = completedSubOrders.reduce((sum, order) => {
      return sum + parseFloat(order.shipping_fee || 0);
    }, 0);

    const totalOrders = completedSubOrders.length;
    const averageIncome = totalOrders > 0 ? totalIncome / totalOrders : 0;

    // Format orders for detailed view
    const formattedOrders = completedSubOrders.map((order) => ({
      id: order.sub_order_id,
      deliveryTime: order.updated_at,
      customerName: order.customer_name || "Không có tên",
      address: order.delivery_address || "Không có địa chỉ",
      paymentMethod: order.payment_method || "COD",
      amount: parseFloat(order.shipping_fee || 0),
    }));

    res.json({
      success: true,
      data: {
        statistics: {
          totalIncome: Math.round(totalIncome * 1000), // Convert to VND
          totalOrders,
          averagePerOrder:
            totalOrders > 0
              ? Math.round((totalIncome * 1000) / totalOrders)
              : 0,
        },
        orders: formattedOrders,
      },
    });
  } catch (error) {
    console.error("Error in getIncomeStats:", error);
    handleError(res, error, "Lấy thống kê thu nhập thất bại");
  }
};

// Lấy chi tiết thu nhập từ đơn hàng
exports.getIncomeDetails = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const orderId = req.params.orderId || req.params.order_id; // Hỗ trợ cả 2 dạng tham số

    console.log("Getting income details for:", {
      userId,
      orderId,
    });

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã đơn hàng",
      });
    }

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    console.log("Found shipper:", shipper ? shipper.toJSON() : null);

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    const subOrder = await SubOrder.findOne({
      where: {
        sub_order_id: orderId,
        status: "delivered",
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          required: false, // Đổi thành false để lấy được sub_order trước
        },
      ],
    });

    console.log("Found subOrder:", subOrder ? subOrder.toJSON() : null);

    if (!subOrder) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin thu nhập từ đơn hàng này",
      });
    }

    // Kiểm tra xem đơn hàng có thuộc về shipper này không
    if (
      !subOrder.shipment ||
      subOrder.shipment.shipper_id !== shipper.shipper_id
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem thông tin thu nhập của đơn hàng này",
      });
    }

    const income = subOrder.shipping_fee || 0;

    const result = {
      success: true,
      data: {
        sub_order_id: subOrder.sub_order_id,
        total_amount: subOrder.total_price || 0,
        shipping_fee: income,
        delivery_date: subOrder.shipment
          ? subOrder.shipment.actual_delivery_date
          : null,
        status: subOrder.status,
      },
    };

    console.log("Sending response:", result);
    res.json(result);
  } catch (error) {
    console.error("Error in getIncomeDetails:", error);
    handleError(res, error, "Lấy chi tiết thu nhập thất bại");
  }
};

// Lọc thu nhập theo ngày
exports.filterIncomeByDate = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { startDate, endDate } = req.query;

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Convert dates to UTC
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const completedOrders = await SubOrder.findAll({
      attributes: ["sub_order_id", "shipping_fee", "updated_at"],
      where: {
        status: "delivered",
        updated_at: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          attributes: [],
          where: {
            shipper_id: shipper.shipper_id,
          },
          required: true,
        },
        {
          model: Order,
          attributes: ["payment_method"],
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name"],
            },
            {
              model: Address,
              as: "shipping_address",
              attributes: ["address_line", "city"],
            },
          ],
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    // Format orders for detailed view
    const formattedOrders = completedOrders.map((order) => ({
      id: order.sub_order_id,
      deliveryTime: order.updated_at,
      customerName: order.Order?.User
        ? `${order.Order.User.first_name} ${order.Order.User.last_name}`
        : "Không có tên",
      address: order.Order?.shipping_address
        ? `${order.Order.shipping_address.address_line}, ${order.Order.shipping_address.city}`
        : "Không có địa chỉ",
      paymentMethod: order.Order?.payment_method || "COD",
      amount: parseFloat(order.shipping_fee || 0) * 1000, // Convert to VND
    }));

    // Calculate statistics
    const totalIncome = formattedOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const totalOrders = formattedOrders.length;
    const averagePerOrder =
      totalOrders > 0 ? Math.round(totalIncome / totalOrders) : 0;

    res.json({
      success: true,
      data: {
        statistics: {
          totalIncome,
          totalOrders,
          averagePerOrder,
        },
        orders: formattedOrders,
      },
    });
  } catch (error) {
    console.error("Error in filterIncomeByDate:", error);
    handleError(res, error, "Lọc thu nhập theo ngày thất bại");
  }
};

// Lọc đơn hàng theo khu vực
exports.filterOrdersByArea = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { city, province, postal_code } = req.query;

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    const whereClause = {
      shipper_id: shipper.shipper_id,
    };

    const addressWhere = {};
    if (city) addressWhere.city = city;
    if (province) addressWhere.province = province;
    if (postal_code) addressWhere.postal_code = postal_code;

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: Shipment,
          attributes: ["status", "created_at", "updated_at"],
        },
        {
          model: Address,
          as: "shippingAddress",
          where: addressWhere,
          attributes: ["address_line", "city", "province", "postal_code"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    handleError(res, error, "Lọc đơn hàng theo khu vực thất bại");
  }
};

// Tìm kiếm đơn hàng
exports.searchOrder = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.query;

    const shipper = await Shipper.findOne({ where: { user_id: userId } });
    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    const order = await Order.findOne({
      where: {
        order_id: orderId,
        shipper_id: shipper.shipper_id,
      },
      include: [
        {
          model: Shipment,
          attributes: [
            "status",
            "created_at",
            "updated_at",
            "expected_delivery_date",
          ],
        },
        {
          model: Address,
          as: "shippingAddress",
          attributes: ["address_line", "city", "province", "postal_code"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    handleError(res, error, "Tìm kiếm đơn hàng thất bại");
  }
};

// Xem lịch sử đơn hàng
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const shipper = await Shipper.findOne({ where: { user_id: userId } });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    const orders = await Order.findAll({
      where: {
        shipper_id: shipper.shipper_id,
        status: {
          [Op.in]: ["completed", "cancelled"],
        },
      },
      include: [
        {
          model: Shipment,
          attributes: [
            "status",
            "created_at",
            "updated_at",
            "actual_delivery_date",
          ],
        },
        {
          model: Address,
          as: "shippingAddress",
          attributes: ["address_line", "city", "province", "postal_code"],
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    handleError(res, error, "Lấy lịch sử đơn hàng thất bại");
  }
};

// Lấy thống kê dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const shipper = await Shipper.findOne({
      where: { user_id: userId },
      attributes: ["shipper_id"],
    });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Lấy ngày hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Đếm số đơn hàng hôm nay (chưa có shipper hoặc thuộc về shipper hiện tại)
    const todayOrders = await SubOrder.count({
      where: {
        created_at: {
          [Op.gte]: today,
        },
        [Op.or]: [
          {
            status: "processing",
            "$shipment.shipper_id$": null,
          },
          {
            status: {
              [Op.in]: ["shipped", "delivered"],
            },
            "$shipment.shipper_id$": shipper.shipper_id,
          },
        ],
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          required: false,
          attributes: [],
        },
      ],
    });

    // Đếm số đơn hàng đã hoàn thành
    const completedOrders = await SubOrder.count({
      where: {
        status: "delivered",
        "$shipment.shipper_id$": shipper.shipper_id,
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          required: true,
          attributes: [],
        },
      ],
    });

    // Đếm số đơn hàng đang chờ (chưa có shipper hoặc đang giao)
    const pendingOrders = await SubOrder.count({
      where: {
        [Op.or]: [
          {
            status: "processing",
            "$shipment.shipper_id$": null,
          },
          {
            status: "shipped",
            "$shipment.shipper_id$": shipper.shipper_id,
          },
        ],
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          required: false,
          attributes: [],
        },
      ],
    });

    // Tính tổng doanh thu hôm nay
    const todayRevenue =
      (await SubOrder.sum("shipping_fee", {
        where: {
          status: "delivered",
          updated_at: {
            [Op.gte]: today,
          },
          "$shipment.shipper_id$": shipper.shipper_id,
        },
        include: [
          {
            model: Shipment,
            as: "shipment",
            required: true,
            attributes: [],
          },
        ],
      })) || 0;

    // Set headers to prevent caching
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.json({
      success: true,
      data: {
        todayOrders,
        completedOrders,
        pendingOrders,
        todayRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lấy thống kê dashboard thất bại",
      error: {
        message: error.message,
        name: error.name,
      },
    });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.user_id;

    // Tìm shipper
    const shipper = await Shipper.findOne({
      where: { user_id: userId },
      attributes: ["shipper_id"],
    });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin shipper",
      });
    }

    // Tìm sub_order và kiểm tra trạng thái
    const subOrder = await SubOrder.findOne({
      where: {
        sub_order_id: orderId,
        status: "shipped",
        "$shipment.shipper_id$": shipper.shipper_id,
      },
      include: [
        {
          model: Shipment,
          as: "shipment",
          required: true,
        },
      ],
    });

    if (!subOrder) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy",
      });
    }

    // Bắt đầu transaction
    const result = await sequelize.transaction(async (t) => {
      // Cập nhật trạng thái sub_order
      await subOrder.update({ status: "cancelled" }, { transaction: t });

      // Cập nhật trạng thái shipment
      await subOrder.shipment.update({ status: "failed" }, { transaction: t });

      return subOrder;
    });

    res.json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Hủy đơn hàng thất bại",
      error: error.message,
    });
  }
};
