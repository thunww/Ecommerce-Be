module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Sub_Orders", [
      {
        sub_order_id: 1,
        order_id: 1,
        shop_id: 1,
        total_price: 250.0,
        shipping_fee: 20.0,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        sub_order_id: 2,
        order_id: 1,
        shop_id: 2,
        total_price: 150.0,
        shipping_fee: 15.0,
        status: "processing",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        sub_order_id: 3,
        order_id: 2,
        shop_id: 3,
        total_price: 300.0,
        shipping_fee: 25.0,
        status: "shipped",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        sub_order_id: 4,
        order_id: 3,
        shop_id: 1,
        total_price: 400.0,
        shipping_fee: 30.0,
        status: "delivered",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        sub_order_id: 5,
        order_id: 3,
        shop_id: 2,
        total_price: 200.0,
        shipping_fee: 10.0,
        status: "cancelled",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Thêm dữ liệu cố định khác nếu cần...
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Sub_Orders", null, {});
  },
};
