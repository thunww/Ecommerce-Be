"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Product_Variants", [
      // Variants for iPhone 15 Pro Max (Product ID: 1)
      {
        product_id: 1,
        size: null,
        color: "Space Gray",
        material: "Aluminum",
        storage: 128,
        ram: 6,
        processor: "A17 Pro chip",
        weight: 0.3,
        price: 32990000,
        stock: 50,
        image_url:
          "https://i.pcmag.com/imagery/reviews/032Ghc5tCjiCya7cxiW3B5O-11.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 1,
        size: null,
        color: "Silver",
        material: "Aluminum",
        storage: 256,
        ram: 6,
        processor: "A17 Pro chip",
        weight: 0.3,
        price: 34990000,
        stock: 30,
        image_url:
          "https://www.canbuyornot.com/wp-content/uploads/2021/04/Lenovo-Legion-5-Pro_1.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for MacBook Pro M3 (Product ID: 2)
      {
        product_id: 2,
        size: "16-inch",
        color: "Space Gray",
        material: "Aluminum",
        storage: 512,
        ram: 16,
        processor: "M3 chip",
        weight: 1.5,
        price: 45990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nq118f5.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 2,
        size: "14-inch",
        color: "Silver",
        material: "Aluminum",
        storage: 256,
        ram: 8,
        processor: "M3 chip",
        weight: 1.4,
        price: 42990000,
        stock: 10,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6ho5awp44fb38.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Nike Air Force 1 Shoes (Product ID: 3)
      {
        product_id: 3,
        size: "10 US",
        color: "White",
        material: "Leather",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.8,
        price: 2990000,
        stock: 50,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltnqk8e33q4tf2.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 3,
        size: "9 US",
        color: "Black",
        material: "Leather",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.8,
        price: 3090000,
        stock: 30,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6hod4hkz5ugfa.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Samsung 500L Refrigerator (Product ID: 4)
      {
        product_id: 4,
        size: null,
        color: "Silver",
        material: "Steel",
        storage: null,
        ram: null,
        processor: null,
        weight: 60.0,
        price: 12990000,
        stock: 10,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltnqk8e33q4tf2.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Sony WH-1000XM5 Headphones (Product ID: 5)
      {
        product_id: 5,
        size: null,
        color: "Black",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.4,
        price: 7990000,
        stock: 40,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nkerg1c.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 5,
        size: null,
        color: "Silver",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.4,
        price: 8190000,
        stock: 30,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nq118f5.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for LG 55-inch OLED TV (Product ID: 6)
      {
        product_id: 6,
        size: "55-inch",
        color: "Black",
        material: "OLED",
        storage: null,
        ram: null,
        processor: null,
        weight: 18.0,
        price: 27990000,
        stock: 15,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nq118f5.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Adidas Ultraboost 23 (Product ID: 7)
      {
        product_id: 7,
        size: "10 US",
        color: "White",
        material: "Primeknit",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.7,
        price: 3500000,
        stock: 60,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nkerg1c.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 7,
        size: "9 US",
        color: "Black",
        material: "Primeknit",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.7,
        price: 3400000,
        stock: 50,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nq118f5.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Apple Watch Series 9 (Product ID: 8)
      {
        product_id: 8,
        size: "40mm",
        color: "Space Gray",
        material: "Aluminum",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.2,
        price: 11990000,
        stock: 25,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7iqwashoz4o19.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Variants for Sony PlayStation 5 (Product ID: 9)
      {
        product_id: 9,
        size: null,
        color: "White",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 4.5,
        price: 15990000,
        stock: 35,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv69p2xficnu6d.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for HP LaserJet Pro Printer (Product ID: 10)
      {
        product_id: 10,
        size: null,
        color: "Black",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 8.0,
        price: 5990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3i807hmm9j09e.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Samsung Galaxy Z Flip 5 (Product ID: 11)
      {
        product_id: 11,
        size: null,
        color: "Phantom Black",
        material: "Glass",
        storage: 256,
        ram: 8,
        processor: "Snapdragon 8 Gen 2",
        weight: 0.3,
        price: 28990000,
        stock: 15,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-3f1s92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 11,
        size: null,
        color: "Cream",
        material: "Glass",
        storage: 128,
        ram: 8,
        processor: "Snapdragon 8 Gen 2",
        weight: 0.3,
        price: 25990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-3f1s92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Google Pixel 8 Pro (Product ID: 12)
      {
        product_id: 12,
        size: null,
        color: "Obsidian",
        material: "Glass",
        storage: 128,
        ram: 12,
        processor: "Google Tensor G3",
        weight: 0.2,
        price: 25990000,
        stock: 40,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-5f9u02bzvgb58a5.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Xbox Series X (Product ID: 13)
      {
        product_id: 13,
        size: null,
        color: "Black",
        material: "Plastic",
        storage: 1,
        ram: 16,
        processor: "Custom AMD",
        weight: 4.4,
        price: 16990000,
        stock: 25,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-xx9w92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Dyson Airwrap (Product ID: 14)
      {
        product_id: 14,
        size: null,
        color: "Iron/Fuchsia",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.6,
        price: 14990000,
        stock: 15,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-f9js92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Huawei MatePad Pro (Product ID: 15)
      {
        product_id: 15,
        size: "12.6-inch",
        color: "Matte Gray",
        material: "Aluminum",
        storage: 128,
        ram: 8,
        processor: "Kirin 990",
        weight: 0.6,
        price: 17990000,
        stock: 30,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-h9js92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Xiaomi Mi 13 Ultra (Product ID: 16)
      {
        product_id: 16,
        size: null,
        color: "Black",
        material: "Glass",
        storage: 256,
        ram: 12,
        processor: "Snapdragon 8 Gen 2",
        weight: 0.2,
        price: 25990000,
        stock: 50,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-v8js92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Nintendo Switch OLED (Product ID: 17)
      {
        product_id: 17,
        size: null,
        color: "White",
        material: "Plastic",
        storage: 64,
        ram: 4,
        processor: "NVIDIA Tegra X1",
        weight: 0.4,
        price: 7990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m1gs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Variants for DJI Mavic 3 (Product ID: 18)
      {
        product_id: 18,
        size: null,
        color: "Gray",
        material: "Plastic",
        storage: 64,
        ram: null,
        processor: null,
        weight: 0.9,
        price: 35990000,
        stock: 10,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-12hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Canon EOS R5 Camera (Product ID: 19)
      {
        product_id: 19,
        size: null,
        color: "Black",
        material: "Magnesium alloy",
        storage: 512,
        ram: 16,
        processor: "DIGIC X",
        weight: 0.7,
        price: 79990000,
        stock: 5,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-c5js92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Samsung Galaxy Watch 6 (Product ID: 20)
      {
        product_id: 20,
        size: "40mm",
        color: "Graphite",
        material: "Aluminum",
        storage: 16,
        ram: 2,
        processor: "Exynos W920",
        weight: 0.3,
        price: 6990000,
        stock: 25,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-e7js92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Dell XPS 13 (Product ID: 21)
      {
        product_id: 21,
        size: "13-inch",
        color: "Platinum Silver",
        material: "Aluminum",
        storage: 512,
        ram: 16,
        processor: "Intel Core i7-1165G7",
        weight: 1.2,
        price: 27990000,
        stock: 10,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-j5hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Fitbit Charge 5 (Product ID: 22)
      {
        product_id: 22,
        size: null,
        color: "Black",
        material: "Silicone",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.03,
        price: 3299000,
        stock: 50,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-d2hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for LG Gram 17 (Product ID: 23)
      {
        product_id: 23,
        size: "17-inch",
        color: "Dark Silver",
        material: "Aluminum",
        storage: 1,
        ram: 16,
        processor: "Intel Core i7-1165G7",
        weight: 1.3,
        price: 24990000,
        stock: 12,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-b4hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Bose QuietComfort 45 (Product ID: 24)
      {
        product_id: 24,
        size: null,
        color: "Black",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.3,
        price: 12990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-d1hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Microsoft Surface Laptop 4 (Product ID: 25)
      {
        product_id: 25,
        size: "15-inch",
        color: "Platinum",
        material: "Aluminum",
        storage: 512,
        ram: 16,
        processor: "Intel Core i7-1185G7",
        weight: 1.5,
        price: 31990000,
        stock: 15,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-a6hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Samsung Galaxy Tab S8 Ultra (Product ID: 26)
      {
        product_id: 26,
        size: "14.6-inch",
        color: "Graphite",
        material: "Aluminum",
        storage: 128,
        ram: 8,
        processor: "Snapdragon 8 Gen 1",
        weight: 0.7,
        price: 24990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-k7hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for OnePlus 11 5G (Product ID: 27)
      {
        product_id: 27,
        size: null,
        color: "Eternal Green",
        material: "Glass",
        storage: 256,
        ram: 16,
        processor: "Snapdragon 8 Gen 2",
        weight: 0.2,
        price: 18990000,
        stock: 30,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m7hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Variants for Xiaomi Mi 11 (Product ID: 28)
      {
        product_id: 28,
        size: null,
        color: "Horizon Blue",
        material: "Glass",
        storage: 128,
        ram: 8,
        processor: "Snapdragon 888",
        weight: 0.196,
        price: 17990000,
        stock: 25,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-h8hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Samsung Galaxy Z Flip 5 (Product ID: 29)
      {
        product_id: 29,
        size: null,
        color: "Graphite",
        material: "Glass",
        storage: 256,
        ram: 8,
        processor: "Snapdragon 8 Gen 2",
        weight: 0.187,
        price: 28990000,
        stock: 15,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-u8hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Apple AirPods Pro (2nd generation) (Product ID: 30)
      {
        product_id: 30,
        size: null,
        color: "White",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.05,
        price: 6590000,
        stock: 40,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-f7hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Variants for Huawei P50 Pro (Product ID: 32)
      {
        product_id: 32,
        size: null,
        color: "Golden Black",
        material: "Glass",
        storage: 256,
        ram: 8,
        processor: "Kirin 9000",
        weight: 0.195,
        price: 18990000,
        stock: 18,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-n8hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Sony Xperia 1 IV (Product ID: 33)
      {
        product_id: 33,
        size: null,
        color: "Black",
        material: "Glass",
        storage: 256,
        ram: 12,
        processor: "Snapdragon 8 Gen 1",
        weight: 0.225,
        price: 27990000,
        stock: 12,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m8hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Sony A7 III Camera (Product ID: 34)
      {
        product_id: 34,
        size: null,
        color: "Black",
        material: "Magnesium alloy",
        storage: 128,
        ram: 8,
        processor: "BIONZ X",
        weight: 0.65,
        price: 34990000,
        stock: 5,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-x8hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Bose SoundLink Revolve+ Bluetooth Speaker (Product ID: 35)
      {
        product_id: 35,
        size: null,
        color: "Triple Black",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 1.0,
        price: 7990000,
        stock: 15,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-i8hs92b7ixn0d9w.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Product_Variants", null, {});
  },
};
