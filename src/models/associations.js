// Định nghĩa quan hệ giữa các bảng
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
    ProductImage,
    ProductReview,
    Shop,
    ShopReview,
    Shipment,
    Wishlist,
    UserCoupon,
    Shipper,
    Cart,
    CartItem,
  } = db;

  // Quan hệ User - Role (N-N)
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "user_id",
    as: "roles",
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "role_id",
    as: "users",
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
  User.hasMany(Address, { foreignKey: "user_id", as: "addresses" });
  Address.belongsTo(User, { foreignKey: "user_id" });

  // Quan hệ Category - Product (1-N)
  Category.hasMany(Product, {
    foreignKey: "category_id",
    as: "products",
    onDelete: "SET NULL"
  });
  Product.belongsTo(Category, {
    foreignKey: "category_id",
    as: "Category"
  });

  // Quan hệ Category - Category (Danh mục cha - con)
  Category.belongsTo(Category, {
    foreignKey: "parent_id",
    as: "parentCategory",
  });
  Category.hasMany(Category, { foreignKey: "parent_id", as: "subCategories" });

  // Quan hệ Coupon - UserCoupon (1-N)
  Coupon.hasMany(UserCoupon, { foreignKey: "coupon_id", as: "userCoupons" });
  UserCoupon.belongsTo(Coupon, { foreignKey: "coupon_id" });

  // Quan hệ User - UserCoupon (1-N)
  User.hasMany(UserCoupon, { foreignKey: "user_id", as: "coupons" });
  UserCoupon.belongsTo(User, { foreignKey: "user_id" });

  // Quan hệ User - Notification (1-N)
  User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
  Notification.belongsTo(User, { foreignKey: "user_id" });

  // Quan hệ User - Order (1-N)
  User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  // Quan hệ Order - SubOrder (1-N)
  Order.hasMany(SubOrder, { foreignKey: "order_id", as: "subOrders" });
  SubOrder.belongsTo(Order, { foreignKey: "order_id" });

  // Quan hệ SubOrder - OrderItem (1-N)
  SubOrder.hasMany(OrderItem, { foreignKey: "sub_order_id", as: "orderItems" });
  OrderItem.belongsTo(SubOrder, { foreignKey: "sub_order_id" });

  // Quan hệ OrderItem - Product (N-1)
  Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    as: "orderItems",
    onDelete: "CASCADE",
  });
  OrderItem.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
    onDelete: "CASCADE",
  });

  // Quan hệ Order - Payment (1-N)
  Order.hasMany(Payment, {
    foreignKey: 'order_id',
    as: 'payments',
    onDelete: 'CASCADE',
  });
  Payment.belongsTo(Order, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
  });

  // Quan hệ SubOrder - Payment (1-N)
  SubOrder.hasMany(Payment, {
    foreignKey: 'sub_order_id',
    as: 'payments',
    onDelete: 'CASCADE',
  });
  Payment.belongsTo(SubOrder, {
    foreignKey: 'sub_order_id',
    onDelete: 'CASCADE',
  });

  // Quan hệ Order - Address (N-1)
  Order.belongsTo(Address, {
    foreignKey: 'shipping_address_id',
    as: 'shipping_address',
    onDelete: 'CASCADE',
  });
  Address.hasMany(Order, {
    foreignKey: 'shipping_address_id',
    as: 'orders',
    onDelete: 'CASCADE',
  });

  // Quan hệ User - Shipper (1-1)
  User.hasOne(Shipper, { foreignKey: "user_id", as: "shipper" });
  Shipper.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // Quan hệ Shipper - Shipment (1-N)
  Shipper.hasMany(Shipment, { foreignKey: "shipper_id", as: "shipments" });
  Shipment.belongsTo(Shipper, { foreignKey: "shipper_id", as: "shipper" });

  // Quan hệ Product - ProductImage (1-N)
  Product.hasMany(ProductImage, {
    foreignKey: "product_id",
    as: "images",
    onDelete: "CASCADE"
  });
  ProductImage.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
  });

  // Quan hệ Product - ProductReview (1-N)
  Product.hasMany(ProductReview, {
    foreignKey: "product_id",
    as: "reviews",
    onDelete: "CASCADE"
  });
  ProductReview.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
  });

  // Quan hệ User - ProductReview (1-N)
  User.hasMany(ProductReview, {
    foreignKey: "user_id",
    as: "productReviews"
  });
  ProductReview.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
  });

  // Quan hệ Shop - Product (1-N)
  Shop.hasMany(Product, {
    foreignKey: "shop_id",
    as: "products",
    onDelete: "CASCADE"
  });
  Product.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "Shop"
  });

  // Quan hệ Shop - ShopReview (1-N)
  Shop.hasMany(ShopReview, { foreignKey: "shop_id", as: "reviews" });
  ShopReview.belongsTo(Shop, { foreignKey: "shop_id" });

  // Quan hệ Shop - SubOrder (1-N)
  Shop.hasMany(SubOrder, { foreignKey: "shop_id", as: "subOrders" });
  SubOrder.belongsTo(Shop, { foreignKey: "shop_id" });

  // Quan hệ User - Shop (1-N) (Người dùng là chủ shop)
  User.hasMany(Shop, { foreignKey: "owner_id", as: "shops" });
  Shop.belongsTo(User, { foreignKey: "owner_id" });

  // Quan hệ Shipment - SubOrder (1-1)
  SubOrder.hasOne(Shipment, {
    foreignKey: "sub_order_id",
    as: "shipment",
    onDelete: "CASCADE",
  });
  Shipment.belongsTo(SubOrder, {
    foreignKey: "sub_order_id",
    onDelete: "CASCADE",
  });

  // Quan hệ Wishlist - User (N-1)
  User.hasMany(Wishlist, { foreignKey: "user_id", as: "wishlists" });
  Wishlist.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

  // Quan hệ Wishlist - Product (N-1)
  Product.hasMany(Wishlist, {
    foreignKey: "product_id",
    as: "wishlistedByUsers",
    onDelete: "CASCADE"
  });
  Wishlist.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "product"
  });

  // Quan hệ User - Cart (1-1)
  User.hasOne(Cart, {
    foreignKey: 'user_id',
    as: 'cart',
    onDelete: 'CASCADE'
  });

  Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    as: 'items',
    onDelete: 'CASCADE'
  });

  Cart.belongsToMany(Shop, {
    through: CartItem,
    foreignKey: 'cart_id',
    otherKey: 'shop_id',
    as: 'shops'
  });

  // CartItem associations
  CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
  });

  CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
  });

  CartItem.belongsTo(Shop, {
    foreignKey: 'shop_id',
    as: 'shop'
  });
};
