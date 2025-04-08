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
                    items: [],
                    shippingFee: 0,
                    discount: 0,
                    total_price: 0
                };
            }

            // Lấy các items trong giỏ hàng
            const cartItems = await CartItem.findAll({
                where: { cart_id: cart.cart_id },
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'product_name', 'description', 'price', 'stock', 'shop_id'],
                        include: [
                            {
                                model: Shop,
                                as: 'Shop',
                                attributes: ['shop_id', 'shop_name', 'logo']
                            },
                            {
                                model: ProductImage,
                                as: 'images',
                                attributes: ['image_url']
                            }
                        ]
                    },
                    {
                        model: ProductVariant,
                        as: 'variant',
                        attributes: ['variant_id', 'size', 'color', 'material', 'storage', 'ram', 'processor', 'stock', 'price']
                    }
                ]
            });

            // Biến đổi dữ liệu để phù hợp với cấu trúc frontend
            const formattedItems = cartItems.map(item => {
                // Chuẩn bị dữ liệu cho variant
                let variantName = '';
                if (item.variant) {
                    const variantAttributes = [];
                    if (item.variant.size) variantAttributes.push(`${item.variant.size}`);
                    if (item.variant.color) variantAttributes.push(`${item.variant.color}`);
                    if (item.variant.material) variantAttributes.push(`${item.variant.material}`);
                    if (item.variant.storage) variantAttributes.push(`${item.variant.storage}`);
                    if (item.variant.ram) variantAttributes.push(`${item.variant.ram}`);
                    if (item.variant.processor) variantAttributes.push(`${item.variant.processor}`);
                    variantName = variantAttributes.join(' / ');
                }

                // Lấy URL hình ảnh đầu tiên
                const productImage = item.product.images && item.product.images.length > 0
                    ? item.product.images[0].image_url
                    : 'https://placehold.co/600x400?text=No+Image';

                // Lấy giá gốc nếu có variant hoặc lấy giá sản phẩm
                const price = item.variant ? item.variant.price : item.product.price;

                return {
                    id: item.cart_item_id,  // Frontend sử dụng id
                    cart_item_id: item.cart_item_id,
                    product_id: item.product_id,
                    name: item.product.product_name,
                    product_name: item.product.product_name,
                    image: productImage,
                    product_image: productImage,
                    variant_id: item.product_variant_id,
                    variant_name: variantName || 'Mặc định',
                    price: parseFloat(price),
                    original_price: parseFloat(item.product.price) > parseFloat(price) ? parseFloat(item.product.price) : null,
                    quantity: item.quantity,
                    stock: item.variant ? item.variant.stock : item.product.stock,
                    shop_id: item.shop_id,
                    shop_name: item.product.Shop ? item.product.Shop.shop_name : '',
                    description: item.product.description
                };
            });

            // Tổng hợp thông tin - sử dụng dữ liệu từ session hoặc tính toán tạm thời
            // Lưu ý: Đây là giải pháp tạm thời cho đến khi model Cart được cập nhật
            // với các trường discount và shipping_fee
            const discount = 0;  // Sẽ tính sau khi apply coupon
            const shippingFee = 0; // Sẽ tính sau khi chọn phương thức vận chuyển

            return {
                items: formattedItems,
                total_price: parseFloat(cart.total_price),
                shippingFee: shippingFee,
                discount: discount,
                subtotal: parseFloat(cart.total_price),
                total: parseFloat(cart.total_price) - discount + shippingFee
            };
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng với các sản phẩm:', error);
            throw new Error('Không thể lấy thông tin giỏ hàng. Vui lòng thử lại sau.');
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
            const cart = await Cart.findOne({
                where: { user_id }
            });

            if (!cart) {
                return {
                    items: [],
                    shippingFee: 0,
                    discount: 0
                };
            }

            // Xóa tất cả các items trong giỏ hàng
            await CartItem.destroy({
                where: { cart_id: cart.cart_id }
            });

            // Cập nhật tổng tiền về 0
            cart.total_price = 0;
            await cart.save();

            // Trả về giỏ hàng rỗng
            return {
                items: [],
                shippingFee: 0,
                discount: 0
            };
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
            throw new Error('Không thể xóa giỏ hàng. Vui lòng thử lại sau.');
        }
    }

    async applyCoupon(user_id, couponCode) {
        try {
            // TODO: Cần implement thêm model Coupon và logic xác thực mã giảm giá
            // Ví dụ: const coupon = await Coupon.findOne({ where: { code: couponCode, is_active: true } });

            // Xác thực user có giỏ hàng và giỏ hàng có sản phẩm
            const cart = await Cart.findOne({
                where: { user_id }
            });

            if (!cart) {
                throw new Error('Không tìm thấy giỏ hàng');
            }

            // Kiểm tra tổng giá trị giỏ hàng
            if (cart.total_price < 100000) {
                throw new Error('Giá trị đơn hàng tối thiểu để sử dụng mã giảm giá là 100.000đ');
            }

            // Tạm thời tính giảm giá mẫu
            let discount = 0;
            switch (couponCode.toUpperCase()) {
                case 'WELCOME10':
                    discount = Math.min(cart.total_price * 0.1, 50000); // Giảm 10%, tối đa 50k
                    break;
                case 'SAVE20':
                    discount = Math.min(cart.total_price * 0.2, 100000); // Giảm 20%, tối đa 100k
                    break;
                case 'FREESHIP':
                    discount = 30000; // Miễn phí vận chuyển 30k
                    break;
                default:
                    throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
            }

            // Lưu mã giảm giá và giá trị giảm vào session hoặc lưu vào bảng tạm thời
            // Vì model Cart chưa có trường này, nên tạm thời chúng ta sẽ sử dụng cách gửi giá trị về frontend
            // và frontend sẽ lưu lại trong state của mình

            return {
                code: couponCode,
                discount: parseFloat(discount.toFixed(2))
            };
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
            throw new Error(error.message || 'Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.');
        }
    }

    async calculateShipping(user_id, address) {
        try {
            // Xác thực user có giỏ hàng
            const cart = await Cart.findOne({
                where: { user_id }
            });

            if (!cart) {
                throw new Error('Không tìm thấy giỏ hàng');
            }

            // Lấy các item trong giỏ hàng
            const cartItems = await CartItem.findAll({
                where: { cart_id: cart.cart_id }
            });

            if (!cartItems || cartItems.length === 0) {
                throw new Error('Giỏ hàng trống');
            }

            // Tính tổng khối lượng sản phẩm (tạm tính)
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalWeight = totalQuantity * 0.5; // Giả sử mỗi sản phẩm 0.5kg

            // Tính phí vận chuyển dựa vào địa chỉ và tổng khối lượng
            let shippingFee = 0;
            let estimatedTime = '';

            // Logic tính phí vận chuyển đơn giản
            if (totalWeight <= 1) {
                shippingFee = 20000; // Dưới 1kg: 20k
                estimatedTime = '1-2 ngày';
            } else if (totalWeight <= 3) {
                shippingFee = 30000; // 1-3kg: 30k
                estimatedTime = '2-3 ngày';
            } else if (totalWeight <= 5) {
                shippingFee = 40000; // 3-5kg: 40k
                estimatedTime = '3-4 ngày';
            } else {
                shippingFee = 50000; // Trên 5kg: 50k
                estimatedTime = '3-5 ngày';
            }

            // Miễn phí vận chuyển nếu đơn hàng trên 500k
            if (cart.total_price >= 500000) {
                shippingFee = 0;
                estimatedTime = '2-4 ngày';
            }

            // Lưu phí vận chuyển vào session hoặc lưu vào bảng tạm thời
            // Vì model Cart chưa có trường này, nên tạm thời chúng ta sẽ sử dụng cách gửi giá trị về frontend

            return {
                fee: parseFloat(shippingFee.toFixed(2)),
                estimatedTime: estimatedTime,
                address: address
            };
        } catch (error) {
            console.error('Lỗi khi tính phí vận chuyển:', error);
            throw new Error(error.message || 'Không thể tính phí vận chuyển. Vui lòng thử lại sau.');
        }
    }

    // Phương thức mới để lấy thông tin giảm giá và phí giao hàng
    async getCartSummary(user_id, session = {}) {
        try {
            const cart = await Cart.findOne({
                where: { user_id }
            });

            if (!cart) {
                return {
                    subtotal: 0,
                    discount: 0,
                    shipping_fee: 0,
                    total: 0,
                    coupon_code: null
                };
            }

            // Lấy thông tin giảm giá và phí vận chuyển từ session hoặc tạm thời hardcoded
            // Trong thực tế, chúng ta có thể lưu những thông tin này trong session hoặc tạo bảng tạm thời
            const discount = session.discount || 0;
            const shipping_fee = session.shipping_fee || 0;
            const coupon_code = session.coupon_code || null;

            const subtotal = parseFloat(cart.total_price);
            const total = subtotal - discount + shipping_fee;

            return {
                subtotal,
                discount,
                shipping_fee,
                total,
                coupon_code
            };
        } catch (error) {
            console.error('Lỗi khi lấy thông tin tổng hợp giỏ hàng:', error);
            throw new Error('Không thể lấy thông tin tổng hợp giỏ hàng. Vui lòng thử lại sau.');
        }
    }

    // Phương thức để xóa mã giảm giá khỏi giỏ hàng
    async removeCoupon(user_id) {
        try {
            const cart = await Cart.findOne({
                where: { user_id }
            });

            if (!cart) {
                throw new Error('Không tìm thấy giỏ hàng');
            }

            // Trong trường hợp của chúng ta, ta chỉ cần trả về thông báo vì chúng ta không lưu coupon_code
            // trong model Cart

            return {
                message: 'Đã xóa mã giảm giá khỏi giỏ hàng',
                discount: 0,
                coupon_code: null
            };
        } catch (error) {
            console.error('Lỗi khi xóa mã giảm giá:', error);
            throw new Error(error.message || 'Không thể xóa mã giảm giá. Vui lòng thử lại sau.');
        }
    }
}

module.exports = new CartService(); 