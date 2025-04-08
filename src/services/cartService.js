const { Cart, CartItem, Product, Shop, User, ProductImage, ProductVariant } = require('../models');
const { Op } = require('sequelize');

class CartService {
    async getOrCreateCart(user_id) {
        try {
            let cart = await Cart.findOne({
                where: { user_id }
            });

            if (!cart) {
                cart = await Cart.create({
                    user_id,
                    total_price: 0
                });
            }

            return cart;
        } catch (error) {
            console.error('Lỗi khi tìm hoặc tạo giỏ hàng:', error);
            throw new Error('Không thể tạo giỏ hàng. Vui lòng thử lại sau.');
        }
    }

    async addToCart(user_id, product_id, quantity = 1, variant_id = null) {
        try {
            if (!user_id) throw new Error('ID người dùng không hợp lệ');
            if (!product_id) throw new Error('ID sản phẩm không hợp lệ');
            if (quantity <= 0) throw new Error('Số lượng phải lớn hơn 0');

            const product = await Product.findByPk(product_id);
            if (!product) {
                throw new Error('Sản phẩm không tồn tại');
            }

            let price = product.price;
            let productVariant = null;
            let variantInfo = null;

            if (variant_id) {
                productVariant = await ProductVariant.findOne({
                    where: {
                        variant_id,
                        product_id
                    }
                });

                if (!productVariant) {
                    throw new Error('Biến thể sản phẩm không tồn tại');
                }

                if (productVariant.stock < quantity) {
                    throw new Error('Số lượng biến thể sản phẩm trong kho không đủ');
                }

                price = productVariant.price;

                variantInfo = {
                    size: productVariant.size,
                    color: productVariant.color,
                    material: productVariant.material,
                    storage: productVariant.storage,
                    ram: productVariant.ram,
                    processor: productVariant.processor
                };
            } else {
                if (product.stock < quantity) {
                    throw new Error('Số lượng sản phẩm trong kho không đủ');
                }
            }

            const cart = await this.getOrCreateCart(user_id);

            let cartItem = await CartItem.findOne({
                where: {
                    cart_id: cart.cart_id,
                    product_id,
                    product_variant_id: variant_id || null
                }
            });

            if (cartItem) {
                const newQuantity = cartItem.quantity + quantity;

                if (variant_id) {
                    if (productVariant.stock < newQuantity) {
                        throw new Error('Số lượng biến thể sản phẩm trong kho không đủ');
                    }
                } else {
                    if (product.stock < newQuantity) {
                        throw new Error('Số lượng sản phẩm trong kho không đủ');
                    }
                }

                cartItem.quantity = newQuantity;
                cartItem.total_price = price * newQuantity;
                await cartItem.save();
            } else {
                cartItem = await CartItem.create({
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

            return await this.getCartWithItems(user_id);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            throw error;
        }
    }

    async getCart(user_id) {
        try {
            if (!user_id) throw new Error('ID người dùng không hợp lệ');

            const cartData = await this.getCartWithItems(user_id);
            return cartData;
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
            throw error;
        }
    }

    async updateCartItem(cart_item_id, quantity) {
        try {
            if (!cart_item_id) throw new Error('ID sản phẩm trong giỏ hàng không hợp lệ');
            if (quantity <= 0) throw new Error('Số lượng phải lớn hơn 0');

            const cartItem = await CartItem.findByPk(cart_item_id, {
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
            });

            if (!cartItem) {
                throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
            }

            // Kiểm tra số lượng tồn kho (dựa vào biến thể hoặc sản phẩm chính)
            if (cartItem.product_variant_id && cartItem.variant) {
                if (cartItem.variant.stock < quantity) {
                    throw new Error('Số lượng biến thể sản phẩm trong kho không đủ');
                }
            } else if (cartItem.product.stock < quantity) {
                throw new Error('Số lượng sản phẩm trong kho không đủ');
            }

            cartItem.quantity = quantity;
            cartItem.total_price = cartItem.price * quantity;
            await cartItem.save();

            // Cập nhật tổng tiền trong giỏ hàng
            await this.updateCartTotals(cartItem.cart_id);

            const cart = await Cart.findByPk(cartItem.cart_id);
            return await this.getCartWithItems(cart.user_id);
        } catch (error) {
            console.error('Lỗi khi cập nhật giỏ hàng:', error);
            throw error;
        }
    }

    async removeFromCart(cart_item_id) {
        try {
            if (!cart_item_id) throw new Error('ID sản phẩm trong giỏ hàng không hợp lệ');

            const cartItem = await CartItem.findByPk(cart_item_id);
            if (!cartItem) {
                throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
            }

            const cart_id = cartItem.cart_id;
            const cart = await Cart.findByPk(cart_id);

            await cartItem.destroy();

            // Cập nhật tổng tiền trong giỏ hàng
            await this.updateCartTotals(cart_id);

            return await this.getCartWithItems(cart.user_id);
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            throw error;
        }
    }

    async getCartWithItems(user_id) {
        try {
            // Kiểm tra giỏ hàng tồn tại
            const cart = await Cart.findOne({
                where: { user_id }
            });

            // Nếu không có giỏ hàng hoặc giỏ hàng trống, trả về response mặc định
            if (!cart) {
                return {
                    status: 'success',
                    data: {
                        cart_id: null,
                        total_price: 0,
                        items_by_shop: []
                    }
                };
            }

            // Lấy các items trong giỏ hàng
            const cartItems = await CartItem.findAll({
                where: { cart_id: cart.cart_id },
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'product_name', 'stock', 'shop_id'],
                        include: [
                            {
                                model: Shop,
                                as: 'Shop',
                                attributes: ['shop_id', 'shop_name', 'logo']
                            },
                            {
                                model: ProductImage,
                                as: 'images',
                                limit: 1,
                                attributes: ['image_url']
                            }
                        ]
                    },
                    {
                        model: ProductVariant,
                        as: 'variant',
                        attributes: ['variant_id', 'size', 'color', 'material', 'storage', 'ram', 'processor', 'stock']
                    }
                ]
            });

            // Nếu không có items, trả về giỏ hàng trống
            if (!cartItems || cartItems.length === 0) {
                return {
                    status: 'success',
                    data: {
                        cart_id: cart.cart_id,
                        total_price: 0,
                        items_by_shop: []
                    }
                };
            }

            // Nhóm items theo shop
            const itemsByShop = {};
            cartItems.forEach(item => {
                const shop_id = item.product.shop_id;
                if (!itemsByShop[shop_id]) {
                    itemsByShop[shop_id] = {
                        shop_id,
                        shop_name: item.product.Shop ? item.product.Shop.shop_name : 'Shop không xác định',
                        shop_logo: item.product.Shop ? item.product.Shop.logo : null,
                        items: []
                    };
                }

                // Format item data
                const formattedItem = {
                    cart_item_id: item.cart_item_id,
                    product_id: item.product.product_id,
                    product_name: item.product.product_name,
                    product_image: item.product.images && item.product.images[0] ? item.product.images[0].image_url : null,
                    price: item.price,
                    quantity: item.quantity,
                    total_price: item.total_price,
                    stock: item.product.stock
                };

                // Add variant info if exists
                if (item.variant) {
                    formattedItem.variant = {
                        variant_id: item.variant.variant_id,
                        size: item.variant.size,
                        color: item.variant.color,
                        material: item.variant.material,
                        storage: item.variant.storage,
                        ram: item.variant.ram,
                        processor: item.variant.processor,
                        stock: item.variant.stock
                    };
                }

                itemsByShop[shop_id].items.push(formattedItem);
            });

            return {
                status: 'success',
                data: {
                    cart_id: cart.cart_id,
                    total_price: cart.total_price,
                    items_by_shop: Object.values(itemsByShop)
                }
            };
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
            throw error;
        }
    }

    async updateCartTotals(cart_id) {
        try {
            const cartItems = await CartItem.findAll({
                where: { cart_id }
            });

            const total_price = cartItems.reduce((sum, item) =>
                sum + parseFloat(item.total_price), 0);

            await Cart.update(
                { total_price },
                { where: { cart_id } }
            );

            return { cart_id, total_price };
        } catch (error) {
            console.error('Lỗi khi cập nhật tổng tiền giỏ hàng:', error);
            throw new Error('Không thể cập nhật tổng tiền giỏ hàng. Vui lòng thử lại sau.');
        }
    }

    async clearCart(user_id) {
        try {
            const cart = await this.getOrCreateCart(user_id);

            // Xóa tất cả các sản phẩm trong giỏ hàng
            await CartItem.destroy({
                where: { cart_id: cart.cart_id }
            });

            // Cập nhật tổng tiền giỏ hàng
            await Cart.update(
                { total_price: 0 },
                { where: { cart_id: cart.cart_id } }
            );

            return await this.getCartWithItems(user_id);
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
            throw new Error('Không thể xóa giỏ hàng. Vui lòng thử lại sau.');
        }
    }
}

module.exports = new CartService(); 