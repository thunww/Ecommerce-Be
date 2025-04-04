const { Order, SubOrder, OrderItem, Cart, CartItem, Product, Shop, Payment } = require('../models');

class OrderService {
    async createOrder(user_id, shipping_address_id, payment_method) {
        let order = null;
        let cart = null;
        try {
            // Lấy giỏ hàng của người dùng
            cart = await Cart.findOne({
                where: { user_id },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }]
            });

            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error('Giỏ hàng trống');
            }

            // Tạo đơn hàng chính
            order = await Order.create({
                user_id,
                shipping_address_id,
                total_price: cart.total_price,
                payment_method,
                status: 'pending',
                payment_status: 'pending',
                created_at: new Date(),
                updated_at: new Date()
            });

            // Nhóm sản phẩm theo shop
            const itemsByShop = {};
            cart.items.forEach(item => {
                if (!itemsByShop[item.product.shop_id]) {
                    itemsByShop[item.product.shop_id] = [];
                }
                itemsByShop[item.product.shop_id].push(item);
            });

            // Tạo sub-orders và order items
            for (const shop_id of Object.keys(itemsByShop)) {
                const shopItems = itemsByShop[shop_id];
                const subOrderTotal = shopItems.reduce((sum, item) =>
                    sum + (item.price * item.quantity), 0);

                // Tạo sub-order
                const subOrder = await SubOrder.create({
                    order_id: order.order_id,
                    shop_id,
                    total_price: subOrderTotal,
                    status: 'pending'
                });

                // Tạo order items
                for (const item of shopItems) {
                    await OrderItem.create({
                        sub_order_id: subOrder.sub_order_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                        total_price: item.total_price
                    });
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

            // Nếu là thanh toán online, trả về URL thanh toán
            if (payment_method !== 'cod') {
                // Reset giỏ hàng chỉ khi tất cả đều thành công
                await CartItem.destroy({ where: { cart_id: cart.cart_id } });
                await Cart.update(
                    { total_price: 0 },
                    { where: { cart_id: cart.cart_id } }
                );

                return {
                    order_id: order.order_id,
                    payment_url: `/api/payment/process/${order.order_id}`,
                    message: 'Vui lòng thanh toán để hoàn tất đơn hàng'
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
                        include: [{
                            model: Product,
                            as: 'product'
                        }]
                    }, {
                        model: Shop
                    }]
                }]
            });

            if (!order) {
                throw new Error('Không tìm thấy đơn hàng');
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
                        include: [{
                            model: Product,
                            as: 'product'
                        }]
                    }, {
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
}

module.exports = new OrderService(); 