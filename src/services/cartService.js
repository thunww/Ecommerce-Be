
const { Cart, CartItem, Product, Shop, User, ProductVariant } = require('../models');
const { Op } = require('sequelize');

class CartService {
    async getOrCreateCart(user_id) {
        let cart = await Cart.findOne({ where: { user_id } });
        if (!cart) {
            cart = await Cart.create({ user_id, total_price: 0 });
        }
        return cart;
    }

    async addToCart(user_id, product_id, quantity = 1, variant_id = null) {
        if (!user_id || !product_id || quantity <= 0) throw new Error('Thông tin không hợp lệ');

        const product = await Product.findByPk(product_id, {
            include: [{ model: Shop, as: 'Shop', attributes: ['shop_id', 'shop_name', 'logo'] }]
        });
        if (!product) throw new Error('Sản phẩm không tồn tại');

        let price = product.price;
        let variantInfo = null;

        if (variant_id) {
            const variant = await ProductVariant.findOne({ where: { variant_id, product_id } });
            if (!variant) throw new Error('Biến thể không tồn tại');
            if (variant.stock < quantity) throw new Error('Kho không đủ hàng');

            price = variant.price;
            variantInfo = {
                size: variant.size, color: variant.color, material: variant.material,
                storage: variant.storage, ram: variant.ram, processor: variant.processor
            };
        } else if (product.stock < quantity) throw new Error('Kho không đủ hàng');

        const cart = await this.getOrCreateCart(user_id);
        let cartItem = await CartItem.findOne({
            where: { cart_id: cart.cart_id, product_id, product_variant_id: variant_id || null }
        });

        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if ((variant_id && variant.stock < newQuantity) || (!variant_id && product.stock < newQuantity)) {
                throw new Error('Kho không đủ hàng');
            }
            cartItem.quantity = newQuantity;
            cartItem.total_price = price * newQuantity;
            await cartItem.save();
        } else {
            await CartItem.create({
                cart_id: cart.cart_id,
                product_id,
                product_variant_id: variant_id || null,
                shop_id: product.shop_id,
                quantity,
                price,
                total_price: price * quantity,
                variant_info: variantInfo ? JSON.stringify(variantInfo) : null
            });
        }

        await this.updateCartTotals(cart.cart_id);
        return this.getCartWithItems(user_id);
    }

    async getCart(user_id) {
        if (!user_id) throw new Error('ID người dùng không hợp lệ');
        return this.getCartWithItems(user_id);
    }

    async updateCartItem(cart_item_id, quantity) {
        if (!cart_item_id || quantity <= 0) throw new Error('Thông tin không hợp lệ');
        const cartItem = await CartItem.findByPk(cart_item_id);
        if (!cartItem) throw new Error('Không tìm thấy sản phẩm');

        const product = await Product.findByPk(cartItem.product_id, {
            include: [{ model: Shop, as: 'Shop', attributes: ['shop_id', 'shop_name', 'logo'] }]
        });
        let variant = null;
        if (cartItem.product_variant_id) {
            variant = await ProductVariant.findByPk(cartItem.product_variant_id);
        }

        if ((variant && variant.stock < quantity) || (!variant && product.stock < quantity)) {
            throw new Error('Kho không đủ hàng');
        }

        cartItem.quantity = quantity;
        cartItem.total_price = cartItem.price * quantity;
        await cartItem.save();

        await this.updateCartTotals(cartItem.cart_id);
        const cart = await Cart.findByPk(cartItem.cart_id);
        return this.getCartWithItems(cart.user_id);
    }

    async removeFromCart(cart_item_id) {
        const cartItem = await CartItem.findByPk(cart_item_id);
        if (!cartItem) throw new Error('Không tìm thấy sản phẩm');

        const cart_id = cartItem.cart_id;
        await cartItem.destroy();
        await this.updateCartTotals(cart_id);

        const cart = await Cart.findByPk(cart_id);
        return this.getCartWithItems(cart.user_id);
    }

    async getCartWithItems(user_id) {
        const cart = await Cart.findOne({
            where: { user_id },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            include: [
                                {
                                    model: Shop,
                                    as: 'Shop',
                                    attributes: ['shop_id', 'shop_name', 'logo']
                                }
                            ]
                        },
                        {
                            model: ProductVariant,
                            as: 'variant'
                        }
                    ]
                }
            ]
        });

        if (!cart) return { items: [], total_price: 0, shippingFee: 0, discount: 0, subtotal: 0, total: 0 };

        const formattedItems = cart.items.map((item) => {
            const variant = item.variant;
            let variantInfo = null;
            try { if (item.variant_info) variantInfo = JSON.parse(item.variant_info); } catch (e) { }

            return {
                cart_item_id: item.cart_item_id,
                product: {
                    product_id: item.product.product_id,
                    product_name: item.product.product_name,
                    shop: item.product.Shop
                },
                variant: variant ? {
                    variant_id: variant.variant_id,
                    name: variant.name,
                    image_url: variant.image_url,
                    attributes: variantInfo,
                    stock: variant.stock,
                    price: variant.price,
                    original_price: variant.original_price
                } : null,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price
            };
        });

        return {
            items: formattedItems,
            total_price: cart.total_price,
            shippingFee: cart.shipping_fee || 0,
            discount: cart.discount || 0,
            subtotal: cart.total_price - (cart.discount || 0),
            total: cart.total_price - (cart.discount || 0) + (cart.shipping_fee || 0)
        };
    }

    async updateCartTotals(cart_id) {
        const items = await CartItem.findAll({ where: { cart_id } });
        const total_price = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
        await Cart.update({ total_price }, { where: { cart_id } });
        return { cart_id, total_price };
    }

    async clearCart(user_id) {
        const cart = await Cart.findOne({ where: { user_id } });
        if (!cart) return { items: [], shippingFee: 0, discount: 0 };

        await CartItem.destroy({ where: { cart_id: cart.cart_id } });
        cart.total_price = 0;
        await cart.save();

        return { items: [], shippingFee: 0, discount: 0 };
    }
}

module.exports = new CartService();
