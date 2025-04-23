module.exports = (db) => {
  const {
    User,
    Role,
    UserRole,
    Address,
    Category,
    Coupon,
    Notification,
    Order,
    SubOrder,
    OrderItem,
    Payment,
    Product,
    ProductReview,
    Shop,
    ShopReview,
    Shipment,
    Wishlist,
    UserCoupon,
    Shipper,
    ProductVariant,
    Cart,
    CartItem,
  } = db;

  // Quan hệ User - Role (N-N)
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "user_id",
    as: "roles",
    onDelete: "CASCADE",
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "role_id",
    as: "users",
    onDelete: "CASCADE",
  });

  UserRole.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
  UserRole.belongsTo(Role, { foreignKey: "role_id", onDelete: "CASCADE" });

  User.hasMany(UserRole, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "userRoles",
  });
  Role.hasMany(UserRole, {
    foreignKey: "role_id",
    onDelete: "CASCADE",
    as: "roleUsers",
  });

  // Quan hệ User - Address (1-N)
  User.hasMany(Address, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "addresses",
  });
  Address.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

  // Quan hệ Category - Product (1-N)
  Category.hasMany(Product, {
    foreignKey: "category_id",
    onDelete: "CASCADE",
    as: "products",
  });
  Product.belongsTo(Category, {
    foreignKey: "category_id",
    onDelete: "CASCADE",
    as: "Category",
  });

  // Quan hệ Category - Category (Danh mục cha - con)
  Category.belongsTo(Category, {
    foreignKey: "parent_id",
    onDelete: "CASCADE",
    as: "parentCategory",
  });
  Category.hasMany(Category, { foreignKey: "parent_id", as: "subCategories" });

  // Quan hệ Coupon - UserCoupon (1-N)
  Coupon.hasMany(UserCoupon, { foreignKey: "coupon_id", as: "userCoupons" });
  UserCoupon.belongsTo(Coupon, { foreignKey: "coupon_id" });

  // Quan hệ User - UserCoupon (1-N)
  User.hasMany(UserCoupon, { foreignKey: "user_id", as: "coupons" });
  UserCoupon.belongsTo(User, { foreignKey: "user_id" });

  // Quan hệ Coupon - Shop (1-N)
  Coupon.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop",
  });
  Shop.hasMany(Coupon, {
    foreignKey: "shop_id",
    as: "coupons",
  });

  // Quan hệ User - Notification (1-N)
  User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
  Notification.belongsTo(User, { foreignKey: "user_id" });

  // Quan hệ User - Order (1-N)
  User.hasMany(Order, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "orders",
  });
  Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

  // Quan hệ Order - SubOrder (1-N)
  Order.hasMany(SubOrder, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
    as: "subOrders",
  });
  SubOrder.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

  // Quan hệ SubOrder - OrderItem (1-N)
  SubOrder.hasMany(OrderItem, {
    foreignKey: "sub_order_id",
    onDelete: "CASCADE",
    as: "orderItems",
  });
  OrderItem.belongsTo(SubOrder, {
    foreignKey: "sub_order_id",
    onDelete: "CASCADE",
  });

  // Quan hệ OrderItem - Product (N-1)
  Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "orderItems",
  });
  OrderItem.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "product",
  });

  // Quan hệ Order - Payment (1-N)
  Order.hasMany(Payment, {
    foreignKey: "order_id",
    as: "payments",
    onDelete: "CASCADE",
  });
  Payment.belongsTo(Order, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
  });

  // Quan hệ SubOrder - Payment (1-N)
  SubOrder.hasMany(Payment, {
    foreignKey: "sub_order_id",
    as: "payments",
    onDelete: "CASCADE",
  });
  Payment.belongsTo(SubOrder, {
    foreignKey: "sub_order_id",
    onDelete: "CASCADE",
  });

  // Quan hệ Order - Address (N-1)
  Order.belongsTo(Address, {
    foreignKey: "shipping_address_id",
    as: "shipping_address",
    onDelete: "CASCADE",
  });
  Address.hasMany(Order, {
    foreignKey: "shipping_address_id",
    as: "orders",
    onDelete: "CASCADE",
  });

  // Quan hệ Product - ProductReview (1-N)
  Product.hasMany(ProductReview, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "reviews",
  });
  ProductReview.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
  });

  // Quan hệ User - ProductReview (1-N)
  User.hasMany(ProductReview, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "productReviews",
  });
  ProductReview.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "user",
  });

  // Quan hệ Shop - Product (1-N)
  Shop.hasMany(Product, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "products",
  });
  Product.belongsTo(Shop, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "Shop",
  });

  // Quan hệ Shop - ShopReview (1-N)
  Shop.hasMany(ShopReview, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "reviews",
  });
  ShopReview.belongsTo(Shop, { foreignKey: "shop_id", onDelete: "CASCADE" });

  // Quan hệ Shop - SubOrder (1-N)
  Shop.hasMany(SubOrder, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "subOrders",
  });
  SubOrder.belongsTo(Shop, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "shop",
  });

  // Quan hệ User - Shop (1-N) (Người dùng là chủ shop)
  User.hasMany(Shop, {
    foreignKey: "owner_id",
    onDelete: "CASCADE",
    as: "shops",
  });
  Shop.belongsTo(User, { foreignKey: "owner_id", onDelete: "CASCADE" });

  // Quan hệ Shipment - SubOrder (1-1)
  SubOrder.hasOne(Shipment, {
    foreignKey: "sub_order_id",
    as: "shipment",
    onDelete: "CASCADE",
  });
  Shipment.belongsTo(SubOrder, {
    foreignKey: "sub_order_id",
    as: "subOrder",
    onDelete: "CASCADE",
  });

  // Quan hệ Wishlist - User (N-1)
  User.hasMany(Wishlist, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "wishlists",
  });
  Wishlist.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

  // Quan hệ Wishlist - Product (N-1)
  Product.hasMany(Wishlist, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "wishlistedByUsers",
  });
  Wishlist.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "product",
  });

  Product.hasMany(ProductVariant, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "variants",
  });

  ProductVariant.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "product",
  });

  // Quan hệ ProductVariant - OrderItem (1-N)
  ProductVariant.hasMany(OrderItem, {
    foreignKey: "variant_id",
    as: "orderItems",
  });

  // Quan hệ OrderItem - ProductVariant (N-1)
  OrderItem.belongsTo(ProductVariant, {
    foreignKey: "variant_id",
    as: "productVariant",
    onDelete: "SET NULL",
  });

  // Quan hệ ProductVariant - Wishlist (N-1)
  ProductVariant.hasMany(Wishlist, {
    foreignKey: "variant_id",
    onDelete: "CASCADE",
    as: "wishlistedByUsers",
  });

  Wishlist.belongsTo(ProductVariant, {
    foreignKey: "variant_id",
    onDelete: "CASCADE",
    as: "variant",
  });

  // Quan hệ User - Cart (1-1)
  User.hasOne(Cart, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "cart",
  });
  Cart.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "user",
  });

  // Quan hệ Cart - CartItem (1-N)
  Cart.hasMany(CartItem, {
    foreignKey: "cart_id",
    onDelete: "CASCADE",
    as: "items",
  });
  CartItem.belongsTo(Cart, {
    foreignKey: "cart_id",
    onDelete: "CASCADE",
    as: "cart",
  });

  // Quan hệ Product - CartItem (1-N)
  Product.hasMany(CartItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "cartItems",
  });
  CartItem.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "product",
  });

  // Quan hệ Shop - CartItem (1-N)
  Shop.hasMany(CartItem, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "cartItems",
  });
  CartItem.belongsTo(Shop, {
    foreignKey: "shop_id",
    onDelete: "CASCADE",
    as: "shop",
  });

  // Quan hệ ProductVariant - CartItem (1-N)
  ProductVariant.hasMany(CartItem, {
    foreignKey: "product_variant_id",
    onDelete: "CASCADE",
    as: "cartItems",
  });
  CartItem.belongsTo(ProductVariant, {
    foreignKey: "product_variant_id",
    onDelete: "CASCADE",
    as: "variant",
  });
};
