module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Categories", [
      {
        category_name: "Điện thoại & Phụ kiện",
        parent_id: null,
        description: "Các loại điện thoại, phụ kiện và thiết bị thông minh.",
        image: "https://example.com/images/category-phone.jpg",
        created_at: new Date(),
        updated_at: new Date(), 
      },
      {
        category_name: "Laptop & Máy tính",
        parent_id: null,
        description: "Laptop, linh kiện và phụ kiện máy tính.",
        image: "https://example.com/images/category-laptop.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_name: "Thời trang nam",
        parent_id: null,
        description: "Quần áo, giày dép, phụ kiện cho nam.",
        image: "https://example.com/images/category-men-fashion.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_name: "Thời trang nữ",
        parent_id: null,
        description: "Quần áo, giày dép, phụ kiện cho nữ.",
        image: "https://example.com/images/category-women-fashion.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_name: "Điện tử & Gia dụng",
        parent_id: null,
        description: "Các thiết bị điện tử, gia dụng như TV, tủ lạnh.",
        image: "https://example.com/images/category-electronics.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
