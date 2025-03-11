module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Shops", [
      {
        owner_id: 1,
        shop_name: "Cửa hàng điện tử",
        description: "Chuyên cung cấp sản phẩm công nghệ cao cấp",
        logo: "https://example.com/images/shop1-logo.jpg",
        banner: "https://example.com/images/shop1-banner.jpg",
        rating: 4.5,
        followers: 1200,
        total_products: 200,
        address: "123 Đường Lê Lợi, Quận 1, TP. HCM",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 2,
        shop_name: "Thời trang cao cấp",
        description: "Shop chuyên về quần áo, giày dép và phụ kiện",
        logo: "https://example.com/images/shop2-logo.jpg",
        banner: "https://example.com/images/shop2-banner.jpg",
        rating: 4.8,
        followers: 2500,
        total_products: 350,
        address: "45 Nguyễn Huệ, Quận 1, TP. HCM",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 3,
        shop_name: "Nhà sách ABC",
        description: "Chuyên cung cấp sách, văn phòng phẩm và quà tặng",
        logo: "https://example.com/images/shop3-logo.jpg",
        banner: "https://example.com/images/shop3-banner.jpg",
        rating: 4.6,
        followers: 900,
        total_products: 500,
        address: "78 Trần Hưng Đạo, Quận 5, TP. HCM",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Shops", null, {});
  },
};
