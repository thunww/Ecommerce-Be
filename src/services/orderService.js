const { Order, SubOrder, OrderItem, Cart, CartItem, Product, Shop, Payment, ProductVariant, Coupon } = require('../models');
const couponService = require('./couponService');

class OrderService {
  async createOrder(user_id, shipping_address_id, payment_method, coupon_code = null) {
    let order = null;
    let cart = null;
    let couponDiscount = 0;
    let validatedCoupon = null;

    try {
      // Lấy giỏ hàng của người dùng
      cart = await Cart.findOne({
        where: { user_id },
        include: [{
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            },
            {
              model: ProductVariant,
              as: 'variant'
            }
          ]
        }]
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('Giỏ hàng trống');
      }

      // Kiểm tra và áp dụng mã giảm giá nếu có
      if (coupon_code) {
        try {
          validatedCoupon = await couponService.validateCoupon(coupon_code, user_id, cart.total_price);
          couponDiscount = validatedCoupon.discount_amount;
        } catch (couponError) {
          throw new Error(`Mã giảm giá không hợp lệ: ${couponError.message}`);
        }
      }

      // Tính tổng tiền sau khi áp dụng mã giảm giá
      const finalPrice = cart.total_price - couponDiscount;

      // Tạo đơn hàng chính
      order = await Order.create({
        user_id,
        shipping_address_id,
        total_price: cart.total_price,
        discount_amount: couponDiscount,
        final_amount: finalPrice,
        coupon_id: validatedCoupon ? validatedCoupon.coupon_id : null,
        payment_method,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      });

      // Nhóm sản phẩm theo shop
      const itemsByShop = {};
      cart.items.forEach((item) => {
        if (!itemsByShop[item.product.shop_id]) {
          itemsByShop[item.product.shop_id] = [];
        }
        itemsByShop[item.product.shop_id].push(item);
      });

      // Tạo sub-orders và order items
      for (const shop_id of Object.keys(itemsByShop)) {
        const shopItems = itemsByShop[shop_id];
        const subOrderTotal = shopItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Tạo sub-order
        const subOrder = await SubOrder.create({
          order_id: order.order_id,
          shop_id,
          total_price: subOrderTotal,
          status: "pending",
        });

        // Tạo order items và cập nhật số lượng tồn kho
        for (const item of shopItems) {
          await OrderItem.create({
            sub_order_id: subOrder.sub_order_id,
            product_id: item.product_id,
            variant_id: item.product_variant_id || null,
            quantity: item.quantity,
            price: item.price,
            total_price: item.total_price,
            variant_info: item.variant_info
          });

          // Cập nhật số lượng tồn kho cho sản phẩm hoặc biến thể
          if (item.product_variant_id && item.variant) {
            // Nếu là sản phẩm có biến thể, cập nhật stock của biến thể
            await ProductVariant.decrement('stock', {
              by: item.quantity,
              where: { variant_id: item.product_variant_id }
            });

            // Cập nhật thêm giá trị sold cho biến thể nếu cần
            await ProductVariant.increment('sold', {
              by: item.quantity,
              where: { variant_id: item.product_variant_id }
            });
          } else {
            // Nếu là sản phẩm không có biến thể, cập nhật stock của sản phẩm
            await Product.decrement('stock', {
              by: item.quantity,
              where: { product_id: item.product_id }
            });

            // Cập nhật thêm giá trị sold cho sản phẩm
            await Product.increment('sold', {
              by: item.quantity,
              where: { product_id: item.product_id }
            });
          }
        }

        // Tạo payment cho sub-order
        await Payment.create({
          order_id: order.order_id,
          sub_order_id: subOrder.sub_order_id,
          payment_method: payment_method,
          status: 'pending',
          amount: subOrderTotal
        });
      }

      // Đánh dấu mã giảm giá đã được sử dụng nếu có
      if (validatedCoupon) {
        const coupon = await Coupon.findByPk(validatedCoupon.coupon_id);
        if (coupon) {
          await couponService.applyCouponToOrder(order.order_id, coupon.code, user_id);
        }
      }

      // Nếu là thanh toán online, trả về URL thanh toán
      if (payment_method !== "cod") {
        // Reset giỏ hàng chỉ khi tất cả đều thành công
        await CartItem.destroy({ where: { cart_id: cart.cart_id } });
        await Cart.update(
          { total_price: 0 },
          { where: { cart_id: cart.cart_id } }
        );

        return {
          order_id: order.order_id,
          payment_url: `/api/payment/process/${order.order_id}`,
          message: "Vui lòng thanh toán để hoàn tất đơn hàng",
        };
      }

      // Reset giỏ hàng chỉ khi tất cả đều thành công
      await CartItem.destroy({ where: { cart_id: cart.cart_id } });
      await Cart.update(
        { total_price: 0 },
        { where: { cart_id: cart.cart_id } }
      );

      return await this.getOrderDetails(order.order_id);
    } catch (error) {
      // Nếu có lỗi và đã tạo order, xóa order
      if (order) {
        await Order.destroy({ where: { order_id: order.order_id } });
      }
      throw error;
    }
  }

  async getOrderDetails(order_id) {
    try {
      const order = await Order.findOne({
        where: { order_id },
        include: [{
          model: SubOrder,
          as: 'subOrders',
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                include: [
                  {
                    model: Shop,
                    as: 'Shop'
                  }
                ]
              },
              {
                model: ProductVariant,
                as: 'productVariant'
              }
            ]
          },
          {
            model: Shop,
            as: 'shop'
          }]
        }]
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  async getUserOrders(user_id) {
    try {
      const orders = await Order.findAll({
        where: { user_id },
        include: [{
          model: SubOrder,
          as: 'subOrders',
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                include: [
                  {
                    model: Shop,
                    as: 'Shop'
                  }
                ]
              },
              {
                model: ProductVariant,
                as: 'productVariant'
              }
            ]
          },
          {
            model: Shop,
            as: 'shop'
          }]
        }],
        order: [['created_at', 'DESC']]
      });

      return orders;
    } catch (error) {
      throw error;
    }
  }
  // lay san pham da ban cua shop
  async getShopOrderedProducts(shop_id) {
    try {
      const subOrders = await SubOrder.findAll({
        where: { shop_id },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product",
                attributes: [
                  "product_id",
                  "product_name",
                  "description",
                  "discount",
                  "stock",
                  "sold",
                  "status",
                ],
                include: [
                  {
                    model: ProductVariant,
                    as: "variants",
                    attributes: [
                      "variant_id",
                      "size",
                      "color",
                      "material",
                      "price",
                      "stock",
                      "image_url",
                    ],
                  },
                ],
              },
            ],
            attributes: ["quantity", "price", "discount", "total"],
          },
          {
            model: Order,
            attributes: ["created_at", "status", "payment_status"],
          },
        ],
        attributes: ["sub_order_id", "total_price", "status"],
        order: [[Order, "created_at", "DESC"]],
      });

      // Tạo Map để tổng hợp thông tin sản phẩm
      const productMap = new Map();

      subOrders.forEach((subOrder) => {
        subOrder.orderItems.forEach((orderItem) => {
          const productId = orderItem.product.product_id;
          const variants = orderItem.product.variants || [];

          variants.forEach((variant) => {
            const key = `${productId}-${variant.variant_id}`;

            if (!productMap.has(key)) {
              productMap.set(key, {
                product_id: productId,
                product_name: orderItem.product.product_name,
                description: orderItem.product.description,
                product_status: orderItem.product.status,
                variant_id: variant.variant_id,
                size: variant.size,
                color: variant.color,
                material: variant.material,
                price: variant.price,
                current_stock: variant.stock,
                image_url: variant.image_url,
                total_quantity_sold: 0,
                total_revenue: 0,
                order_count: 0,
                latest_order_status: subOrder.status,
                latest_order_date: subOrder.Order.created_at,
              });
            }

            const product = productMap.get(key);
            product.total_quantity_sold += orderItem.quantity;
            product.total_revenue += parseFloat(orderItem.total || 0);
            product.order_count += 1;
          });
        });
      });

      return Array.from(productMap.values());
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy danh sách sản phẩm đã bán: ${error.message}`
      );
    }
  }
}

module.exports = new OrderService();
