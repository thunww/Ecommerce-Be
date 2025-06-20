module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Shops", [
      {
        owner_id: 6, // Vendor
        shop_name: "Electronics Store",
        description: "Specializing in high-end technology products",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG4TkxkFuXifNvLsDDaCB69Khm1LzrMFJLJA&s",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 3.0,
        followers: 1200,
        total_products: 200,
        views: 5000,
        address: "123 Le Loi Street, District 1, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 9, // Vendor
        shop_name: "High-End Fashion",
        description: "Specializing in clothing, shoes, and accessories",
        logo: "https://s3-symbol-logo.tradingview.com/avt-natural-products--600.png",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.8,
        followers: 2500,
        total_products: 350,
        views: 7200,
        address: "45 Nguyen Hue, District 1, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 13, // Vendor
        shop_name: "ABC Bookstore",
        description: "Specializing in books, stationery, and gifts",
        logo: "https://th.bing.com/th/id/OIP.4V-SOe0yjOivytzOhuqw5gHaHa?rs=1&pid=ImgDetMain",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.6,
        followers: 900,
        total_products: 500,
        views: 3200,
        address: "78 Tran Hung Dao, District 5, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 17, // Vendor
        shop_name: "Furniture Store",
        description: "Providing high-quality furniture",
        logo: "https://th.bing.com/th/id/OIP.IlTS2EpbppkgqhbJgchZ0wHaHa?w=1280&h=1280&rs=1&pid=ImgDetMain",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.7,
        followers: 1800,
        total_products: 150,
        views: 5400,
        address: "90 Pham Van Dong, Ho Chi Minh City",
        status: "inactive",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 9, // Vendor
        shop_name: "Gourmet Delights",
        description: "Providing high-quality food and beverages",
        logo: "https://example.com/images/shop5-logo.jpg",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.9,
        followers: 3200,
        total_products: 280,
        views: 8600,
        address: "12 Vo Van Kiet, District 2, Ho Chi Minh City",
        status: "inactive",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 7, // Vendor
        shop_name: "Pet World",
        description: "Everything your pet needs: food, toys, and accessories",
        logo: "https://th.bing.com/th/id/OIP.r2L147Tk-C4ECjSGuuRPLgHaHa?rs=1&pid=ImgDetMain",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.5,
        followers: 1100,
        total_products: 220,
        views: 4700,
        address: "35 Ba Thang Hai, District 10, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 7,
        shop_name: "Sports & Fitness Gear",
        description: "Premium quality sports and fitness equipment",
        logo: "https://th.bing.com/th?id=OIF.0UYA%2baJfSzPNP%2bIe7O3FKA&rs=1&pid=ImgDetMain",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.6,
        followers: 1600,
        total_products: 310,
        views: 6900,
        address: "87 Cach Mang Thang 8, District 3, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 5,
        shop_name: "Luxury Jewelry",
        description: "Fine jewelry and watches from top brands",
        logo: "https://m.media-amazon.com/images/I/51q9f8GJkWL.jpg",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.9,
        followers: 4300,
        total_products: 125,
        views: 9800,
        address: "22 Dong Khoi, District 1, Ho Chi Minh City",
        status: "suspended",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 10,
        shop_name: "Auto Parts & Accessories",
        description: "Car and motorcycle accessories for every model",
        logo: "https://example.com/images/shop9-logo.jpg",
        banner:
          "https://static.vecteezy.com/system/resources/previews/026/787/170/non_2x/9-9-shopping-day-banner-design-with-3d-podium-vector.jpg",
        rating: 4.3,
        followers: 1400,
        total_products: 270,
        views: 6100,
        address: "15 Tan Binh Street, Tan Binh District, Ho Chi Minh City",
        status: "suspended",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 17, // Vendor
        shop_name: "Musical Instruments Store",
        description:
          "Providing the best instruments and accessories for musicians",
        logo: "https://example.com/images/shop10-logo.jpg",
        banner: "https://example.com/images/shop10-banner.jpg",
        rating: 4.7,
        followers: 1700,
        total_products: 200,
        views: 5500,
        address: "99 Nguyen Tri Phuong, District 5, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 17, // Vendor
        shop_name: "Musical Instruments Store 2",
        description:
          "Providing the best instruments and accessories for musicians",
        logo: "https://example.com/images/shop10-logo.jpg",
        banner: "https://example.com/images/shop10-banner.jpg",
        rating: 4.7,
        followers: 2000,
        total_products: 210,
        views: 550,
        address: "99 Nguyen Tri Phuong, District 3, Ho Chi Minh City",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Shops", null, {});
  },
};
