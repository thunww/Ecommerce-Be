//Quản lí đơn hàng, thanh toán, vận chuyển

const orderService = require("../services/orderService");
const { validationResult } = require("express-validator");

class OrderController {
  async createOrder(req, res) {
    try {
      const {
        order_items,
        shipping_address,
        payment_method,
        shipping_fee,
        total_amount,
      } = req.body;
      const user_id = req.user.user_id;

      // Validate phương thức thanh toán
      if (!["cod", "momo", "vnpay", "bank_transfer"].includes(payment_method)) {
        return res
          .status(400)
          .json({ message: "Phương thức thanh toán không hợp lệ" });
      }

      // Validate các trường bắt buộc
      if (
        !order_items ||
        !shipping_address ||
        !payment_method ||
        !total_amount
      ) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }

      // Gộp toàn bộ dữ liệu lại thành 1 object
      const orderData = {
        user_id,
        order_items,
        shipping_address,
        payment_method,
        shipping_fee,
        total_amount,
      };

      console.log(
        "🔥 orderData gửi vào service:",
        JSON.stringify(orderData, null, 2)
      );

      const result = await orderService.createOrder(orderData);

      // Trường hợp thanh toán online → trả về URL thanh toán
      if (payment_method !== "cod" && result.payment_url) {
        return res.status(200).json({
          message: "Đơn hàng đã được tạo, vui lòng thanh toán",
          order_id: result.order_id,
          payment_url: result.payment_url,
        });
      }

      // Trường hợp COD → trả về thành công
      res.status(201).json({
        message: "Đơn hàng đã được tạo thành công",
        order: result,
      });
    } catch (error) {
      console.error("❌ Lỗi trong createOrder:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const { order_id } = req.params;
      const user_id = req.user.user_id;

      const order = await orderService.getOrderDetails(order_id);

      // Kiểm tra xem đơn hàng có thuộc về người dùng không
      if (order.user_id !== user_id) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xem đơn hàng này",
        });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getUserOrders(req, res) {
    try {
      const user_id = req.user.user_id;

      const orders = await orderService.getUserOrders(user_id);

      res.status(200).json({
        success: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi khi lấy danh sách đơn hàng",
      });
    }
  }

  async cancelSubOrder(req, res) {
    try {
      const { sub_order_id } = req.params;
      const user_id = req.user.user_id;

      const result = await orderService.cancelSubOrder(sub_order_id, user_id);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new OrderController();
