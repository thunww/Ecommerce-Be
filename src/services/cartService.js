const { Order, SubOrder, OrderItem, Product, ProductImage } = require('../models');
const { Op } = require('sequelize');

class CartService {
    async addToCart(user_id, product_id, quantity) {
        const product = await Product.findByPk(product_id);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        let order = await Order.findOne({
            where: { user_id, status: 'cart' }
        });

        if (!order) {
            order = await Order.create({
                user_id,
                status: 'cart',
                total_price: 0
            });
        }

        if (!order || !order.order_id) {
            throw new Error('Không thể tạo hoặc tìm thấy đơn hàng');
        }

        // Tìm SubOrder dựa trên order_id và shop_id (giả sử sản phẩm thuộc một shop)
        let subOrder = await SubOrder.findOne({
            where: { order_id: order.order_id, shop_id: product.shop_id } // Cần thêm shop_id vào Product model
        });

        if (!subOrder) {
            subOrder = await SubOrder.create({
                order_id: order.order_id,
                shop_id: product.shop_id, // Giả sử Product có shop_id
                total_price: 0,
                status: 'cart' // Rõ ràng đặt status
            });
        }

        // Kiểm tra OrderItem thay vì SubOrder
        let orderItem = await OrderItem.findOne({
            where: {
                sub_order_id: subOrder.sub_order_id,
                product_id
            }
        });

        if (!orderItem) {
            orderItem = await OrderItem.create({
                sub_order_id: subOrder.sub_order_id,
                product_id,
                quantity,
                price: product.price,
                total: product.price * quantity
            });
        } else {
            // Nếu đã tồn tại, cập nhật quantity và total
            orderItem.quantity += quantity;
            orderItem.total = orderItem.quantity * orderItem.price;
            await orderItem.save();
        }

        // Cập nhật total_price của SubOrder
        const subOrderTotal = await OrderItem.sum('total', {
            where: { sub_order_id: subOrder.sub_order_id }
        });
        subOrder.total_price = subOrderTotal || 0;
        await subOrder.save();

        // Cập nhật total_price của Order
        const orderTotal = await SubOrder.sum('total_price', {
            where: { order_id: order.order_id }
        });
        order.total_price = orderTotal || 0;
        await order.save();

        return await OrderItem.findByPk(orderItem.order_item_id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [{ model: ProductImage, as: 'images', attributes: ['image_url'] }]
                }
            ]
        });
    }

    async getCart(user_id) {
        const order = await Order.findOne({
            where: {
                user_id,
                status: 'cart'
            },
            include: [
                {
                    model: SubOrder,
                    as: 'subOrders',
                    include: [
                        {
                            model: OrderItem,
                            as: 'orderItems',
                            include: [
                                {
                                    model: Product,
                                    as: 'product',
                                    include: [
                                        {
                                            model: ProductImage,
                                            as: 'images',
                                            attributes: ['image_url']
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        return order ? order.subOrders : [];
    }

    async updateCartItem(order_item_id, quantity) {
        const orderItem = await OrderItem.findByPk(order_item_id, {
            include: [
                {
                    model: SubOrder,
                    as: 'subOrder',
                    include: [
                        {
                            model: Order,
                            as: 'order'
                        }
                    ]
                },
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!orderItem) {
            throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
        }

        // Cập nhật số lượng và giá
        orderItem.quantity = quantity;
        orderItem.price = orderItem.product.price;
        await orderItem.save();

        // Cập nhật tổng tiền của suborder
        const subOrder = orderItem.subOrder;
        subOrder.total_amount = orderItem.product.price * quantity;
        await subOrder.save();

        // Cập nhật tổng tiền của order
        const order = subOrder.order;
        const totalAmount = await SubOrder.sum('total_amount', {
            where: { order_id: order.id }
        });
        order.total_price = totalAmount;
        await order.save();

        return await OrderItem.findByPk(order_item_id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['image_url']
                        }
                    ]
                }
            ]
        });
    }

    async removeFromCart(order_item_id) {
        const orderItem = await OrderItem.findByPk(order_item_id, {
            include: [
                {
                    model: SubOrder,
                    as: 'subOrder',
                    include: [
                        {
                            model: Order,
                            as: 'order'
                        }
                    ]
                }
            ]
        });

        if (!orderItem) {
            throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
        }

        const subOrder = orderItem.subOrder;
        const order = subOrder.order;

        // Xóa order item
        await orderItem.destroy();

        // Kiểm tra xem suborder còn sản phẩm nào không
        const remainingItems = await OrderItem.count({
            where: { sub_order_id: subOrder.id }
        });

        if (remainingItems === 0) {
            // Nếu không còn sản phẩm nào, xóa suborder
            await subOrder.destroy();
        } else {
            // Cập nhật tổng tiền của suborder
            const totalAmount = await OrderItem.sum('price * quantity', {
                where: { sub_order_id: subOrder.id }
            });
            subOrder.total_amount = totalAmount;
            await subOrder.save();
        }

        // Cập nhật tổng tiền của order
        const totalAmount = await SubOrder.sum('total_amount', {
            where: { order_id: order.id }
        });
        order.total_price = totalAmount;
        await order.save();

        // Nếu không còn suborder nào, xóa order
        const remainingSubOrders = await SubOrder.count({
            where: { order_id: order.id }
        });

        if (remainingSubOrders === 0) {
            await order.destroy();
        }
    }
}

module.exports = new CartService(); 