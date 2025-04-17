const { Order, SubOrder, OrderItem, Cart, CartItem, Product, Shop, Payment, ProductVariant, Coupon, Address } = require('../models');
const couponService = require('./couponService');
const { Op } = require('sequelize');

class OrderService {
  async createOrder(orderData) {

    console.log('🔥 Dữ liệu đơn hàng nhận được:', JSON.stringify(orderData, null, 2));

    if (!orderData) throw new Error('Thiếu dữ liệu đơn hàng');

    const {
      user_id,
      order_items,
      shipping_address,
      total_amount,
      shipping_fee,
      payment_method
    } = orderData;
    console.log('🔥 order_items từ FE:', JSON.stringify(order_items, null, 2));
    if (!user_id) throw new Error('Thiếu thông tin user_id');
    if (!shipping_address) throw new Error('Thiếu thông tin địa chỉ giao hàng');
    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      throw new Error('Thiếu thông tin sản phẩm đặt hàng');
    }

    try {
      // 👉 1. Tạo địa chỉ giao hàng
      const address = await Address.create({
        user_id,
        phone: shipping_address.phone,
        address_line: shipping_address.address_line,
        city: shipping_address.city,
        province: shipping_address.province
      });

      console.log('✅ Địa chỉ mới được tạo:', address);

      // 👉 2. Tạo đơn hàng chính
      const order = await Order.create({
        user_id,
        shipping_address_id: address.address_id,
        status: 'pending',
        total_price: total_amount,
        shipping_fee,
        payment_method
      });

      console.log('✅ Đơn hàng chính được tạo:', order);

      // 👉 3. Lấy product_id duy nhất
      const productIds = [...new Set(order_items.map(item => item.product_id))];

      // 👉 4. Truy vấn sản phẩm để lấy shop_id
      const products = await Product.findAll({
        where: { product_id: { [Op.in]: productIds } }
      });

      if (products.length !== productIds.length) {
        const existingIds = products.map(p => p.product_id);
        const missingIds = productIds.filter(id => !existingIds.includes(id));
        console.error('🚫 Sản phẩm không tồn tại:', missingIds);
        throw new Error(`Sản phẩm không tồn tại: ${missingIds.join(', ')}`);
      }

      const productMap = {};
      products.forEach(p => {
        productMap[p.product_id] = p.shop_id;
      });

      // 👉 5. Nhóm order_items theo shop_id
      const subOrderGroups = {};
      for (const item of order_items) {
        const shopId = productMap[item.product_id];
        if (!subOrderGroups[shopId]) {
          subOrderGroups[shopId] = [];
        }
        subOrderGroups[shopId].push(item);
      }

      const subOrders = [];

      // 👉 6. Tạo từng SubOrder và các OrderItem chi tiết
      for (const [shopId, items] of Object.entries(subOrderGroups)) {
        const subTotal = items.reduce((sum, item) => {
          const price = parseFloat(item.price);
          const discount = parseFloat(item.discount || 0);
          return sum + (price - discount) * item.quantity;
        }, 0);

        const subOrder = await SubOrder.create({
          order_id: order.order_id,
          shop_id: parseInt(shopId),
          total_price: subTotal,
          shipping_fee: 0
        });

        const subOrderItems = items.map(item => {
          const quantity = item.quantity;
          const price = parseFloat(item.price);
          const discount = parseFloat(item.discount || 0);
          const total = (price - discount) * quantity;

          return {
            order_id: order.order_id,
            sub_order_id: subOrder.sub_order_id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity,
            price,
            discount,
            total,
            variant_info: item.variant_info || null
          };
        });

        await OrderItem.bulkCreate(subOrderItems);
        subOrders.push(subOrder);
      }

      console.log('✅ Đã tạo xong các SubOrder và OrderItem đầy đủ');
      return order;
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng:', error);
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

  async getOrder(orderId) {
    return await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        Address
      ]
    });
  }
}

module.exports = new OrderService();
