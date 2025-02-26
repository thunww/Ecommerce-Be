//Cac quan he cua DB
module.exports = (db) => {
    const { User, Role, Address, Category, Coupon, Notification, Order, SubOrder, OrderItem, Payment, Product, ProductImage, ProductReview, Shop, ShopReview, Shipment, Wishlist, UserCoupon } = db;
  
    //Quan hệ User - Role (N-N)
    User.belongsToMany(Role, { through: 'User_Roles', foreignKey: 'user_id' });
    Role.belongsToMany(User, { through: 'User_Roles', foreignKey: 'role_id' });
  
    //  Quan hệ User - Address (1-N)
    Address.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Address, { foreignKey: 'user_id' });
  
    //  Quan hệ Category - Product (1-N)
    Category.hasMany(Product, { foreignKey: 'category_id' });
    Product.belongsTo(Category, { foreignKey: 'category_id' });
  
    //   Quan hệ Category với chính nó (Danh mục con thuộc danh mục cha)
    Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parentCategory' });
  
    //Quan hệ Coupon - UserCoupon (1-N)
    Coupon.hasMany(UserCoupon, { foreignKey: 'coupon_id' });
    UserCoupon.belongsTo(Coupon, { foreignKey: 'coupon_id' });
  
    //Quan hệ User - Notification (1-N)
    Notification.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  
    //Quan hệ User - Order (1-N)
    Order.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Order, { foreignKey: 'user_id' });
  
    //Quan hệ Order - SubOrder (1-N)
    Order.hasMany(SubOrder, { foreignKey: 'order_id' });
    SubOrder.belongsTo(Order, { foreignKey: 'order_id' });
  
    //Quan hệ SubOrder - OrderItem (1-N)
    SubOrder.hasMany(OrderItem, { foreignKey: 'sub_order_id' });
    OrderItem.belongsTo(SubOrder, { foreignKey: 'sub_order_id' });
  
    //Quan hệ OrderItem - Product (N-1)
    OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
  
    //Quan hệ Payment - SubOrder (1-1)
    Payment.belongsTo(SubOrder, { foreignKey: 'sub_order_id', onDelete: 'CASCADE' });
  
    //Quan hệ Product - ProductImage (1-N)
    Product.hasMany(ProductImage, { foreignKey: 'product_id' });
    ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
  
    //Quan hệ Product - ProductReview (1-N)
    Product.hasMany(ProductReview, { foreignKey: 'product_id' });
    ProductReview.belongsTo(Product, { foreignKey: 'product_id' });
  
    //Quan hệ Shop - Product (1-N)
    Shop.hasMany(Product, { foreignKey: 'shop_id' });
    Product.belongsTo(Shop, { foreignKey: 'shop_id' });
  
    //Quan hệ Shop - ShopReview (1-N)
    Shop.hasMany(ShopReview, { foreignKey: 'shop_id' });
    ShopReview.belongsTo(Shop, { foreignKey: 'shop_id' });
  
    //Quan hệ Shop - SubOrder (1-N)
    Shop.hasMany(SubOrder, { foreignKey: 'shop_id' });
    SubOrder.belongsTo(Shop, { foreignKey: 'shop_id' });
  
    //Quan hệ User - Shop (1-N)
    User.hasMany(Shop, { foreignKey: 'owner_id' });
    Shop.belongsTo(User, { foreignKey: 'owner_id' });
  
    //Quan hệ Shipment - SubOrder (1-1)
    Shipment.belongsTo(SubOrder, { foreignKey: 'sub_order_id', onDelete: 'CASCADE' });
  
    //Quan hệ Shipment - User (shipper)
    Shipment.belongsTo(User, { foreignKey: 'shipper_id', onDelete: 'CASCADE' });
  
    //Quan hệ Wishlist - User (N-1)
    Wishlist.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  
    //Quan hệ Wishlist - Product (N-1)
    Wishlist.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
  };
  