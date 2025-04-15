"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          category_name: "Fashion",
          parent_id: null,
          description: "Clothing, accessories, and shoes.",
          image:
            "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          category_name: "Mobile Phones",
          parent_id: 1, // Assuming 'Electronics' has category_id 1
          description: "Smartphones, feature phones, and accessories.",
          image:
            "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Computers",
          parent_id: 1,
          description: "Laptops, desktops, and accessories.",
          image:
            "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Laptops",
          parent_id: 3, // Assuming 'Computers' has category_id 3
          description: "Portable computers for work and play.",
          image:
            "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Tablets",
          parent_id: 3, // Assuming 'Computers' has category_id 3
          description: "Portable tablets for all needs.",
          image:
            "https://th.bing.com/th/id/OIP.kdTyWTQaNTiR8rixXtE-vAHaHa?w=1600&h=1600&rs=1&pid=ImgDetMain",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Electronics",
          parent_id: null,
          description: "All electronic devices and accessories.",
          image:
            "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Women's Clothing",
          parent_id: 6, // Assuming 'Fashion' has category_id 6
          description: "Clothing for women including dresses, tops, and more.",
          image:
            "https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Men's Clothing",
          parent_id: 6,
          description: "Clothing for men including shirts, trousers, and more.",
          image:
            "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Accessories",
          parent_id: 6,
          description: "Watches, bags, jewelry, and more.",
          image:
            "https://down-vn.img.susercontent.com/file/8e71245b9659ea72c1b4e737be5cf42e@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Home & Living",
          parent_id: null,
          description: "Furniture, decor, and home essentials.",
          image:
            "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Furniture",
          parent_id: 9, // Assuming 'Home & Living' has category_id 9
          description: "Furniture for living rooms, bedrooms, offices, etc.",
          image:
            "https://down-vn.img.susercontent.com/file/e4fbccba5e1189d1141b9d6188af79c0@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Decor",
          parent_id: 9,
          description: "Home decor items like paintings, vases, and lamps.",
          image:
            "https://down-vn.img.susercontent.com/file/e4fbccba5e1189d1141b9d6188af79c0@resize_w640_nl.webp",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Kitchenware",
          parent_id: 9,
          description:
            "Utensils, appliances, and accessories for your kitchen.",
          image: "https://example.com/kitchenware.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Sports & Outdoors",
          parent_id: null,
          description: "Sports equipment and outdoor gear.",
          image: "https://example.com/sports_outdoors.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Camping & Hiking",
          parent_id: 13, // Assuming 'Sports & Outdoors' has category_id 13
          description: "Outdoor gear for camping, hiking, and adventure.",
          image: "https://example.com/camping_hiking.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Fitness & Exercise",
          parent_id: 13,
          description: "Equipment and gear for fitness enthusiasts.",
          image: "https://example.com/fitness_exercise.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Beauty & Health",
          parent_id: null,
          description: "Personal care products and health essentials.",
          image: "https://example.com/beauty_health.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Makeup",
          parent_id: 15, // Assuming 'Beauty & Health' has category_id 15
          description: "Makeup products for all skin types.",
          image: "https://example.com/makeup.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Skincare",
          parent_id: 15,
          description: "Products to keep your skin healthy and glowing.",
          image: "https://example.com/skincare.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Toys & Games",
          parent_id: null,
          description: "Toys for kids and games for all ages.",
          image: "https://example.com/toys_games.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Educational Toys",
          parent_id: 19, // Assuming 'Toys & Games' has category_id 19
          description: "Toys that help children learn and grow.",
          image: "https://example.com/educational_toys.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Action Figures",
          parent_id: 19,
          description: "Action figures and collectibles for fans.",
          image: "https://example.com/action_figures.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
