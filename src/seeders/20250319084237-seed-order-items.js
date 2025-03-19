module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Order_Items", [
      {
        order_item_id: 1,
        sub_order_id: 1,
        product_id: 1,
        quantity: 2,
        price: 100.0,
        discount: 10.0,
        total: 180.0, // (100 * 2) - 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 2,
        sub_order_id: 1,
        product_id: 2,
        quantity: 1,
        price: 50.0,
        discount: 5.0,
        total: 45.0, // (50 * 1) - 5
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 3,
        sub_order_id: 2,
        product_id: 3,
        quantity: 3,
        price: 75.0,
        discount: 15.0,
        total: 210.0, // (75 * 3) - 15
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Thêm dữ liệu cố định khác nếu cần...
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Order_Items", null, {});
  },
};
