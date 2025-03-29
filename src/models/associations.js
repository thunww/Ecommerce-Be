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
  Category.hasMany(Category, {
    foreignKey: "parent_id",
    onDelete: "CASCADE",
    as: "subCategories",
  });

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

  // Quan hệ Payment - SubOrder (1-1)
  SubOrder.hasOne(Payment, {
    foreignKey: "sub_order_id",
    onDelete: "CASCADE",
    as: "payment",
  });
  Payment.belongsTo(SubOrder, {
    foreignKey: "sub_order_id",
    onDelete: "CASCADE",
  });

  // Quan hệ Product - ProductImage (1-N)
  Product.hasMany(ProductImage, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    as: "images",
  });
  ProductImage.belongsTo(Product, {
    foreignKey: "product_id",
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
  SubOrder.belongsTo(Shop, { foreignKey: "shop_id", onDelete: "CASCADE" });

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
    onDelete: "CASCADE",
    as: "shipment",
  });
  Shipment.belongsTo(SubOrder, {
    foreignKey: "sub_order_id",
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
};
