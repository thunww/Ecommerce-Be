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
      {
        order_item_id: 4,
        sub_order_id: 2,
        product_id: 4,
        quantity: 2,
        price: 120.0,
        discount: 20.0,
        total: 220.0, // (120 * 2) - 20
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 5,
        sub_order_id: 3,
        product_id: 5,
        quantity: 1,
        price: 200.0,
        discount: 25.0,
        total: 175.0, // (200 * 1) - 25
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 6,
        sub_order_id: 3,
        product_id: 1,
        quantity: 5,
        price: 100.0,
        discount: 50.0,
        total: 450.0, // (100 * 5) - 50
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 7,
        sub_order_id: 4,
        product_id: 3,
        quantity: 4,
        price: 80.0,
        discount: 20.0,
        total: 300.0, // (80 * 4) - 20
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 8,
        sub_order_id: 5,
        product_id: 2,
        quantity: 6,
        price: 55.0,
        discount: 30.0,
        total: 300.0, // (55 * 6) - 30
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 9,
        sub_order_id: 6,
        product_id: 4,
        quantity: 3,
        price: 150.0,
        discount: 45.0,
        total: 405.0, // (150 * 3) - 45
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 10,
        sub_order_id: 6,
        product_id: 5,
        quantity: 2,
        price: 190.0,
        discount: 20.0,
        total: 360.0, // (190 * 2) - 20
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Order_Items", null, {});
  },
};
