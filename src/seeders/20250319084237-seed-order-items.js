module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Order_Items", [
      // SubOrder #1: total_price 250 - shipping_fee 20 = 230
      {
        order_item_id: 1,
        sub_order_id: 1,
        product_id: 1,
        variant_id: 1,
        quantity: 2,
        price: 100.0,
        discount: 10.0,
        total: 190.0, // (100 * 2) - 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 2,
        sub_order_id: 1,
        product_id: 2,
        variant_id: 2,
        quantity: 1,
        price: 50.0,
        discount: 10.0,
        total: 40.0, // (50 * 1) - 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #2: total_price 150 - shipping_fee 15 = 135
      {
        order_item_id: 3,
        sub_order_id: 2,
        product_id: 3,
        variant_id: 3,
        quantity: 2,
        price: 75.0,
        discount: 15.0,
        total: 135.0, // (75 * 2) - 15
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #3: total_price 300 - shipping_fee 25 = 275
      {
        order_item_id: 4,
        sub_order_id: 3,
        product_id: 4,
        variant_id: 4,
        quantity: 3,
        price: 100.0,
        discount: 25.0,
        total: 275.0, // (100 * 3) - 25
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #4: total_price 140 - shipping_fee 30 = 110
      {
        order_item_id: 5,
        sub_order_id: 4,
        product_id: 2,
        variant_id: 2,
        quantity: 1,
        price: 120.0,
        discount: 10.0,
        total: 110.0, // (120 * 1) - 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #5: total_price 200 - shipping_fee 10 = 190
      {
        order_item_id: 6,
        sub_order_id: 5,
        product_id: 5,
        variant_id: 5,
        quantity: 2,
        price: 100.0,
        discount: 10.0,
        total: 190.0, // (100 * 2) - 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #6: total_price 180 - shipping_fee 12 = 168
      {
        order_item_id: 7,
        sub_order_id: 6,
        product_id: 6,
        variant_id: 6,
        quantity: 2,
        price: 90.0,
        discount: 12.0,
        total: 168.0, // (90 * 2) - 12
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #7: total_price 220 - shipping_fee 18 = 202
      {
        order_item_id: 8,
        sub_order_id: 7,
        product_id: 7,
        variant_id: 7,
        quantity: 2,
        price: 110.0,
        discount: 18.0,
        total: 202.0, // (110 * 2) - 18
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #8: total_price 500 - shipping_fee 20 = 480
      {
        order_item_id: 9,
        sub_order_id: 8,
        product_id: 8,
        variant_id: 8,
        quantity: 3,
        price: 160.0,
        discount: 0.0,
        total: 480.0, // (160 * 3) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #9: total_price 95 - shipping_fee 5 = 90
      {
        order_item_id: 10,
        sub_order_id: 9,
        product_id: 9,
        variant_id: 9,
        quantity: 1,
        price: 90.0,
        discount: 0.0,
        total: 90.0, // (90 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #10: total_price 175 - shipping_fee 15 = 160
      {
        order_item_id: 11,
        sub_order_id: 10,
        product_id: 10,
        variant_id: 10,
        quantity: 2,
        price: 80.0,
        discount: 0.0,
        total: 160.0, // (80 * 2) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #11: total_price 275 - shipping_fee 25 = 250
      {
        order_item_id: 12,
        sub_order_id: 11,
        product_id: 11,
        variant_id: 11,
        quantity: 2,
        price: 130.0,
        discount: 10.0,
        total: 250.0, // (130 * 2) - 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #12: total_price 120 - shipping_fee 10 = 110
      {
        order_item_id: 13,
        sub_order_id: 12,
        product_id: 12,
        variant_id: 12,
        quantity: 1,
        price: 110.0,
        discount: 0.0,
        total: 110.0, // (110 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #13: total_price 210 - shipping_fee 15 = 195
      {
        order_item_id: 14,
        sub_order_id: 13,
        product_id: 13,
        variant_id: 13,
        quantity: 2,
        price: 100.0,
        discount: 5.0,
        total: 195.0, // (100 * 2) - 5
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #14: total_price 90 - shipping_fee 10 = 80
      {
        order_item_id: 15,
        sub_order_id: 14,
        product_id: 14,
        variant_id: 14,
        quantity: 1,
        price: 80.0,
        discount: 0.0,
        total: 80.0, // (80 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #15: total_price 160 - shipping_fee 8 = 152
      {
        order_item_id: 16,
        sub_order_id: 15,
        product_id: 15,
        variant_id: 15,
        quantity: 2,
        price: 80.0,
        discount: 8.0,
        total: 152.0, // (80 * 2) - 8
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #16: total_price 320 - shipping_fee 22 = 298
      {
        order_item_id: 17,
        sub_order_id: 16,
        product_id: 16,
        variant_id: 16,
        quantity: 2,
        price: 150.0,
        discount: 2.0,
        total: 298.0, // (150 * 2) - 2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #17: total_price 110 - shipping_fee 7 = 103
      {
        order_item_id: 18,
        sub_order_id: 17,
        product_id: 17,
        variant_id: 17,
        quantity: 1,
        price: 103.0,
        discount: 0.0,
        total: 103.0, // (103 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #18: total_price 190 - shipping_fee 13 = 177
      {
        order_item_id: 19,
        sub_order_id: 18,
        product_id: 18,
        variant_id: 18,
        quantity: 2,
        price: 90.0,
        discount: 3.0,
        total: 177.0, // (90 * 2) - 3
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #19: total_price 260 - shipping_fee 20 = 240
      {
        order_item_id: 20,
        sub_order_id: 19,
        product_id: 19,
        variant_id: 19,
        quantity: 2,
        price: 120.0,
        discount: 0.0,
        total: 240.0, // (120 * 2) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #20: total_price 130 - shipping_fee 10 = 120
      {
        order_item_id: 21,
        sub_order_id: 20,
        product_id: 20,
        variant_id: 20,
        quantity: 1,
        price: 120.0,
        discount: 0.0,
        total: 120.0, // (120 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #21: total_price 280 - shipping_fee 18 = 262
      {
        order_item_id: 22,
        sub_order_id: 21,
        product_id: 21,
        variant_id: 21,
        quantity: 2,
        price: 135.0,
        discount: 8.0,
        total: 262.0, // (135 * 2) - 8
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #22: total_price 170 - shipping_fee 12 = 158
      {
        order_item_id: 23,
        sub_order_id: 22,
        product_id: 22,
        variant_id: 22,
        quantity: 2,
        price: 80.0,
        discount: 2.0,
        total: 158.0, // (80 * 2) - 2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #23: total_price 350 - shipping_fee 25 = 325
      {
        order_item_id: 24,
        sub_order_id: 23,
        product_id: 23,
        variant_id: 23,
        quantity: 3,
        price: 110.0,
        discount: 5.0,
        total: 325.0, // (110 * 3) - 5
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #24: total_price 200 - shipping_fee 15 = 185
      {
        order_item_id: 25,
        sub_order_id: 24,
        product_id: 24,
        variant_id: 24,
        quantity: 2,
        price: 95.0,
        discount: 5.0,
        total: 185.0, // (95 * 2) - 5
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #25: total_price 145 - shipping_fee 10 = 135
      {
        order_item_id: 26,
        sub_order_id: 25,
        product_id: 25,
        variant_id: 25,
        quantity: 1,
        price: 135.0,
        discount: 0.0,
        total: 135.0, // (135 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #26: total_price 230 - shipping_fee 20 = 210
      {
        order_item_id: 27,
        sub_order_id: 26,
        product_id: 26,
        variant_id: 26,
        quantity: 2,
        price: 105.0,
        discount: 0.0,
        total: 210.0, // (105 * 2) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #27: total_price 180 - shipping_fee 14 = 166
      {
        order_item_id: 28,
        sub_order_id: 27,
        product_id: 27,
        variant_id: 27,
        quantity: 2,
        price: 85.0,
        discount: 4.0,
        total: 166.0, // (85 * 2) - 4
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #28: total_price 270 - shipping_fee 16 = 254
      {
        order_item_id: 29,
        sub_order_id: 28,
        product_id: 28,
        variant_id: 28,
        quantity: 2,
        price: 130.0,
        discount: 6.0,
        total: 254.0, // (130 * 2) - 6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #29: total_price 125 - shipping_fee 8 = 117
      {
        order_item_id: 30,
        sub_order_id: 29,
        product_id: 29,
        variant_id: 29,
        quantity: 1,
        price: 117.0,
        discount: 0.0,
        total: 117.0, // (117 * 1) - 0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #30: total_price 310 - shipping_fee 22 = 288
      {
        order_item_id: 31,
        sub_order_id: 30,
        product_id: 30,
        variant_id: 30,
        quantity: 2,
        price: 145.0,
        discount: 2.0,
        total: 288.0, // (145 * 2) - 2
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Order_Items", null, {});
  },
};