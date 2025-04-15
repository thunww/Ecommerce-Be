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
          image: "https://example.com/fashion.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          category_name: "Mobile Phones",
          parent_id: 1, // Assuming 'Electronics' has category_id 1
          description: "Smartphones, feature phones, and accessories.",
          image: "https://example.com/mobile_phones.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Computers",
          parent_id: 1,
          description: "Laptops, desktops, and accessories.",
          image: "https://example.com/computers.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Laptops",
          parent_id: 3, // Assuming 'Computers' has category_id 3
          description: "Portable computers for work and play.",
          image: "https://example.com/laptops.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Tablets",
          parent_id: 3, // Assuming 'Computers' has category_id 3
          description: "Portable tablets for all needs.",
          image: "https://example.com/tablets.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Electronics",
          parent_id: null,
          description: "All electronic devices and accessories.",
          image: "https://example.com/electronics.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Women's Clothing",
          parent_id: 6, // Assuming 'Fashion' has category_id 6
          description: "Clothing for women including dresses, tops, and more.",
          image: "https://example.com/womens_clothing.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Men's Clothing",
          parent_id: 6,
          description: "Clothing for men including shirts, trousers, and more.",
          image: "https://example.com/mens_clothing.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Accessories",
          parent_id: 6,
          description: "Watches, bags, jewelry, and more.",
          image: "https://example.com/accessories.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Home & Living",
          parent_id: null,
          description: "Furniture, decor, and home essentials.",
          image: "https://example.com/home_living.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Furniture",
          parent_id: 9, // Assuming 'Home & Living' has category_id 9
          description: "Furniture for living rooms, bedrooms, offices, etc.",
          image: "https://example.com/furniture.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Decor",
          parent_id: 9,
          description: "Home decor items like paintings, vases, and lamps.",
          image: "https://example.com/decor.jpg",
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
