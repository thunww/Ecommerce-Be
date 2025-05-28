"use strict";

module.exports = {
  up: async (queryInterface) => {
    const orderItems = [
      // SubOrder #1: total_price 250 - shipping_fee 20 = 230
      {
        order_item_id: 1,
        sub_order_id: 1,
        product_id: 1,
        variant_id: 1, // Khớp với Product_Variants: product_id 1, variant_id 1 (Áo Thun Trơn, size S, White)
        quantity: 2,
        price: 5.2, // 130,000 VND / 25,000 = 5.2 USD
        discount: 10.0,
        total: 0.4, // (5.2 * 2) - 10 = 0.4
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_item_id: 2,
        sub_order_id: 1,
        product_id: 2,
        variant_id: 6, // Khớp với Product_Variants: product_id 2, variant_id 6 (Quần Nỉ, Black)
        quantity: 1,
        price: 7.8, // 195,000 VND / 25,000 = 7.8 USD
        discount: 10.0,
        total: -2.2, // (7.8 * 1) - 10 = -2.2 (âm, cần điều chỉnh discount)
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #2: total_price 150 - shipping_fee 15 = 135
      {
        order_item_id: 3,
        sub_order_id: 2,
        product_id: 3,
        variant_id: 8, // Khớp với Product_Variants: product_id 3, variant_id 8 (Quần Jeans Short, Black)
        quantity: 2,
        price: 6.56, // 164,000 VND / 25,000 = 6.56 USD
        discount: 15.0,
        total: -1.88, // (6.56 * 2) - 15 = -1.88 (âm, cần điều chỉnh discount)
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #3: total_price 300 - shipping_fee 25 = 275
      {
        order_item_id: 4,
        sub_order_id: 3,
        product_id: 4,
        variant_id: 9, // Khớp với Product_Variants: product_id 4, variant_id 9 (Samsung Refrigerator, Black)
        quantity: 3,
        price: 519.6, // 12,990,000 VND / 25,000 = 519.6 USD
        discount: 25.0,
        total: 1533.8, // (519.6 * 3) - 25 = 1533.8
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #4: total_price 140 - shipping_fee 30 = 110
      {
        order_item_id: 5,
        sub_order_id: 4,
        product_id: 2,
        variant_id: 6, // Khớp với Product_Variants: product_id 2, variant_id 6 (Quần Nỉ, Black)
        quantity: 1,
        price: 7.8, // 195,000 VND / 25,000 = 7.8 USD
        discount: 10.0,
        total: -2.2, // (7.8 * 1) - 10 = -2.2 (âm, cần điều chỉnh discount)
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #5: total_price 200 - shipping_fee 10 = 190
      {
        order_item_id: 6,
        sub_order_id: 5,
        product_id: 5,
        variant_id: 11, // Khớp với Product_Variants: product_id 5, variant_id 11 (Tai nghe ONIKUMA, Pink)
        quantity: 2,
        price: 319.6, // 7,990,000 VND / 25,000 = 319.6 USD
        discount: 10.0,
        total: 629.2, // (319.6 * 2) - 10 = 629.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #6: total_price 180 - shipping_fee 12 = 168
      {
        order_item_id: 7,
        sub_order_id: 6,
        product_id: 6,
        variant_id: 12, // Khớp với Product_Variants: product_id 6, variant_id 12 (LG OLED TV, Black)
        quantity: 2,
        price: 1119.6, // 27,990,000 VND / 25,000 = 1119.6 USD
        discount: 12.0,
        total: 2227.2, // (1119.6 * 2) - 12 = 2227.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #7: total_price 220 - shipping_fee 18 = 202
      {
        order_item_id: 8,
        sub_order_id: 7,
        product_id: 7,
        variant_id: 13, // Khớp với Product_Variants: product_id 7, variant_id 13 (Adidas Ultraboost, White)
        quantity: 2,
        price: 14.0, // 350,000 VND / 25,000 = 14.0 USD
        discount: 18.0,
        total: 10.0, // (14.0 * 2) - 18 = 10.0
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #8: total_price 500 - shipping_fee 20 = 480
      {
        order_item_id: 9,
        sub_order_id: 8,
        product_id: 8,
        variant_id: 15, // Khớp với Product_Variants: product_id 8, variant_id 15 (Apple Watch, Space Gray)
        quantity: 3,
        price: 479.6, // 11,990,000 VND / 25,000 = 479.6 USD
        discount: 0.0,
        total: 1438.8, // (479.6 * 3) - 0 = 1438.8
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #9: total_price 95 - shipping_fee 5 = 90
      {
        order_item_id: 10,
        sub_order_id: 9,
        product_id: 9,
        variant_id: 16, // Khớp với Product_Variants: product_id 9, variant_id 16 (Sony PlayStation 5, White)
        quantity: 1,
        price: 639.6, // 15,990,000 VND / 25,000 = 639.6 USD
        discount: 0.0,
        total: 639.6, // (639.6 * 1) - 0 = 639.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #10: total_price 175 - shipping_fee 15 = 160
      {
        order_item_id: 11,
        sub_order_id: 10,
        product_id: 10,
        variant_id: 17, // Khớp với Product_Variants: product_id 10, variant_id 17 (HP Printer, Black)
        quantity: 2,
        price: 239.6, // 5,990,000 VND / 25,000 = 239.6 USD
        discount: 0.0,
        total: 479.2, // (239.6 * 2) - 0 = 479.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #11: total_price 275 - shipping_fee 25 = 250
      {
        order_item_id: 12,
        sub_order_id: 11,
        product_id: 11,
        variant_id: 18, // Khớp với Product_Variants: product_id 11, variant_id 18 (Samsung Z Flip, Phantom Black)
        quantity: 2,
        price: 1159.6, // 28,990,000 VND / 25,000 = 1159.6 USD
        discount: 10.0,
        total: 2309.2, // (1159.6 * 2) - 10 = 2309.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #12: total_price 120 - shipping_fee 10 = 110
      {
        order_item_id: 13,
        sub_order_id: 12,
        product_id: 12,
        variant_id: 19, // Khớp với Product_Variants: product_id 12, variant_id 19 (Google Pixel, Obsidian)
        quantity: 1,
        price: 1039.6, // 25,990,000 VND / 25,000 = 1039.6 USD
        discount: 0.0,
        total: 1039.6, // (1039.6 * 1) - 0 = 1039.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #13: total_price 210 - shipping_fee 15 = 195
      {
        order_item_id: 14,
        sub_order_id: 13,
        product_id: 13,
        variant_id: 22, // Khớp với Product_Variants: product_id 13, variant_id 22 (Xbox Series X, Black)
        quantity: 2,
        price: 679.6, // 16,990,000 VND / 25,000 = 679.6 USD
        discount: 5.0,
        total: 1354.2, // (679.6 * 2) - 5 = 1354.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #14: total_price 90 - shipping_fee 10 = 80
      {
        order_item_id: 15,
        sub_order_id: 14,
        product_id: 14,
        variant_id: 23, // Khớp với Product_Variants: product_id 14, variant_id 23 (Dyson Airwrap, Iron/Fuchsia)
        quantity: 1,
        price: 599.6, // 14,990,000 VND / 25,000 = 599.6 USD
        discount: 0.0,
        total: 599.6, // (599.6 * 1) - 0 = 599.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #15: total_price 160 - shipping_fee 8 = 152
      {
        order_item_id: 16,
        sub_order_id: 15,
        product_id: 15,
        variant_id: 24, // Khớp với Product_Variants: product_id 15, variant_id 24 (Huawei MatePad, Matte Gray)
        quantity: 2,
        price: 719.6, // 17,990,000 VND / 25,000 = 719.6 USD
        discount: 8.0,
        total: 1431.2, // (719.6 * 2) - 8 = 1431.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #16: total_price 320 - shipping_fee 22 = 298
      {
        order_item_id: 17,
        sub_order_id: 16,
        product_id: 16,
        variant_id: 25, // Khớp với Product_Variants: product_id 16, variant_id 25 (Xiaomi Mi 13, Black, 256GB)
        quantity: 2,
        price: 1039.6, // 25,990,000 VND / 25,000 = 1039.6 USD
        discount: 2.0,
        total: 2077.2, // (1039.6 * 2) - 2 = 2077.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #17: total_price 110 - shipping_fee 7 = 103
      {
        order_item_id: 18,
        sub_order_id: 17,
        product_id: 17,
        variant_id: 27, // Khớp với Product_Variants: product_id 17, variant_id 27 (Nintendo Switch, Black)
        quantity: 1,
        price: 319.6, // 7,990,000 VND / 25,000 = 319.6 USD
        discount: 0.0,
        total: 319.6, // (319.6 * 1) - 0 = 319.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #18: total_price 190 - shipping_fee 13 = 177
      {
        order_item_id: 19,
        sub_order_id: 18,
        product_id: 18,
        variant_id: 28, // Khớp với Product_Variants: product_id 18, variant_id 28 (DJI Mavic 3, Gray)
        quantity: 2,
        price: 1439.6, // 35,990,000 VND / 25,000 = 1439.6 USD
        discount: 3.0,
        total: 2876.2, // (1439.6 * 2) - 3 = 2876.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #19: total_price 260 - shipping_fee 20 = 240
      {
        order_item_id: 20,
        sub_order_id: 19,
        product_id: 19,
        variant_id: 29, // Khớp với Product_Variants: product_id 19, variant_id 29 (Canon EOS R5, Black)
        quantity: 2,
        price: 3199.6, // 79,990,000 VND / 25,000 = 3199.6 USD
        discount: 0.0,
        total: 6399.2, // (3199.6 * 2) - 0 = 6399.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #20: total_price 130 - shipping_fee 10 = 120
      {
        order_item_id: 21,
        sub_order_id: 20,
        product_id: 20,
        variant_id: 30, // Khớp với Product_Variants: product_id 20, variant_id 30 (Samsung Galaxy Watch, Graphite)
        quantity: 1,
        price: 279.6, // 6,990,000 VND / 25,000 = 279.6 USD
        discount: 0.0,
        total: 279.6, // (279.6 * 1) - 0 = 279.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #21: total_price 280 - shipping_fee 18 = 262
      {
        order_item_id: 22,
        sub_order_id: 21,
        product_id: 21,
        variant_id: 31, // Khớp với Product_Variants: product_id 21, variant_id 31 (Dell XPS 13, Platinum Silver)
        quantity: 2,
        price: 1119.6, // 27,990,000 VND / 25,000 = 1119.6 USD
        discount: 8.0,
        total: 2231.2, // (1119.6 * 2) - 8 = 2231.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #22: total_price 170 - shipping_fee 12 = 158
      {
        order_item_id: 23,
        sub_order_id: 22,
        product_id: 22,
        variant_id: 32, // Khớp với Product_Variants: product_id 22, variant_id 32 (Fitbit Charge 5, Pink)
        quantity: 2,
        price: 131.96, // 3,299,000 VND / 25,000 = 131.96 USD
        discount: 2.0,
        total: 261.92, // (131.96 * 2) - 2 = 261.92
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #23: total_price 350 - shipping_fee 25 = 325
      {
        order_item_id: 24,
        sub_order_id: 23,
        product_id: 23,
        variant_id: 34, // Khớp với Product_Variants: product_id 23, variant_id 34 (LG Gram 17, Dark Silver)
        quantity: 3,
        price: 999.6, // 24,990,000 VND / 25,000 = 999.6 USD
        discount: 5.0,
        total: 2993.8, // (999.6 * 3) - 5 = 2993.8
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #24: total_price 200 - shipping_fee 15 = 185
      {
        order_item_id: 25,
        sub_order_id: 24,
        product_id: 24,
        variant_id: 35, // Khớp với Product_Variants: product_id 24, variant_id 35 (Bose QuietComfort, Black)
        quantity: 2,
        price: 519.6, // 12,990,000 VND / 25,000 = 519.6 USD
        discount: 5.0,
        total: 1034.2, // (519.6 * 2) - 5 = 1034.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #25: total_price 145 - shipping_fee 10 = 135
      {
        order_item_id: 26,
        sub_order_id: 25,
        product_id: 25,
        variant_id: 36, // Khớp với Product_Variants: product_id 25, variant_id 36 (Surface Laptop, Platinum)
        quantity: 1,
        price: 1279.6, // 31,990,000 VND / 25,000 = 1279.6 USD
        discount: 0.0,
        total: 1279.6, // (1279.6 * 1) - 0 = 1279.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #26: total_price 230 - shipping_fee 20 = 210
      {
        order_item_id: 27,
        sub_order_id: 26,
        product_id: 26,
        variant_id: 37, // Khớp với Product_Variants: product_id 26, variant_id 37 (Samsung Tab S8, Graphite)
        quantity: 2,
        price: 999.6, // 24,990,000 VND / 25,000 = 999.6 USD
        discount: 0.0,
        total: 1999.2, // (999.6 * 2) - 0 = 1999.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #27: total_price 180 - shipping_fee 14 = 166
      {
        order_item_id: 28,
        sub_order_id: 27,
        product_id: 27,
        variant_id: 38, // Khớp với Product_Variants: product_id 27, variant_id 38 (OnePlus 11, Eternal Green)
        quantity: 2,
        price: 759.6, // 18,990,000 VND / 25,000 = 759.6 USD
        discount: 4.0,
        total: 1515.2, // (759.6 * 2) - 4 = 1515.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #28: total_price 270 - shipping_fee 16 = 254
      {
        order_item_id: 29,
        sub_order_id: 28,
        product_id: 28,
        variant_id: 39, // Khớp với Product_Variants: product_id 28, variant_id 39 (Xiaomi Mi 11, Horizon Blue)
        quantity: 2,
        price: 719.6, // 17,990,000 VND / 25,000 = 719.6 USD
        discount: 6.0,
        total: 1433.2, // (719.6 * 2) - 6 = 1433.2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #29: total_price 125 - shipping_fee 8 = 117
      {
        order_item_id: 30,
        sub_order_id: 29,
        product_id: 29,
        variant_id: 40, // Khớp với Product_Variants: product_id 29, variant_id 40 (Samsung Z Flip, Graphite)
        quantity: 1,
        price: 1159.6, // 28,990,000 VND / 25,000 = 1159.6 USD
        discount: 0.0,
        total: 1159.6, // (1159.6 * 1) - 0 = 1159.6
        created_at: new Date(),
        updated_at: new Date(),
      },
      // SubOrder #30: total_price 310 - shipping_fee 22 = 288
      {
        order_item_id: 31,
        sub_order_id: 30,
        product_id: 30,
        variant_id: 30, // Sửa để khớp với Product_Variants: product_id 30, variant_id 30 (AirPods Pro, White)
        quantity: 2,
        price: 263.6, // 6,590,000 VND / 25,000 = 263.6 USD
        discount: 2.0,
        total: 525.2, // (263.6 * 2) - 2 = 525.2
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Order_Items", orderItems);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Order_Items", null, {});
  },
};