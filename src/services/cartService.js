const { Cart, CartItem, Product, Shop } = require("../models");

class CartService {
  async getOrCreateCart(user_id) {
    let cart = await Cart.findOne({
      where: { user_id },
    });

    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    return cart;
  }

  async addToCart(user_id, product_id, quantity) {
    try {
      const cart = await this.getOrCreateCart(user_id);
      const product = await Product.findByPk(product_id);

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      let cartItem = await CartItem.findOne({
        where: {
          cart_id: cart.cart_id,
          product_id,
        },
      });

      if (cartItem) {
        // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
        cartItem.quantity += quantity;
        cartItem.total_price = cartItem.price * cartItem.quantity;
        await cartItem.save();
      } else {
        // Nếu sản phẩm chưa có trong giỏ, tạo mới
        cartItem = await CartItem.create({
          cart_id: cart.cart_id,
          product_id,
          shop_id: product.shop_id,
          quantity,
          price: product.price,
          total_price: product.price * quantity,
        });
      }

      // Cập nhật tổng số lượng và tổng tiền trong giỏ hàng
      await this.updateCartTotals(cart.cart_id);

      return await this.getCartWithItems(user_id);
    } catch (error) {
      throw error;
    }
  }

  async getCart(user_id) {
    try {
      return await this.getCartWithItems(user_id);
    } catch (error) {
      throw error;
    }
  }

  async updateCartItem(cart_item_id, quantity) {
    try {
      const cartItem = await CartItem.findByPk(cart_item_id);
      if (!cartItem) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
      }

      cartItem.quantity = quantity;
      cartItem.total_price = cartItem.price * quantity;
      await cartItem.save();

      // Cập nhật tổng số lượng và tổng tiền trong giỏ hàng
      await this.updateCartTotals(cartItem.cart_id);

      const cart = await Cart.findByPk(cartItem.cart_id);
      return await this.getCartWithItems(cart.user_id);
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(cart_item_id) {
    try {
      const cartItem = await CartItem.findByPk(cart_item_id);
      if (!cartItem) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
      }

      const cart_id = cartItem.cart_id;
      await cartItem.destroy();

      // Cập nhật tổng số lượng và tổng tiền trong giỏ hàng
      await this.updateCartTotals(cart_id);

      const cart = await Cart.findByPk(cart_id);
      return await this.getCartWithItems(cart.user_id);
    } catch (error) {
      throw error;
    }
  }

  async getCartWithItems(user_id) {
    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: Shop,
                  as: "Shop",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return {
        cart_id: null,
        user_id,
        total_price: 0,
        items: [],
      };
    }

    return cart;
  }

  async updateCartTotals(cart_id) {
    const cartItems = await CartItem.findAll({
      where: { cart_id },
    });

    const total_items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.total_price),
      0
    );

    await Cart.update({ total_price }, { where: { cart_id } });
  }
}

module.exports = new CartService();
