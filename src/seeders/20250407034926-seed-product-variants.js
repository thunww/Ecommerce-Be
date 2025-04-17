"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Product_Variants", [
      {
        product_id: 1,
        size: "S",
        color: "White",
        material: "Cotton",
        storage: null,
        ram: null,
        processor: null,
        weight: null,
        price: 130000,
        stock: 150,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lg3xv4rhl3p350@resize_w900_nl.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 1,
        size: "M",
        color: "Brown",
        material: "Cotton",
        storage: null,
        ram: null,
        processor: null,
        weight: null,
        price: 130000,
        stock: 150,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lg3xv4rhgvzr68@resize_w900_nl.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        product_id: 1,
        size: "L",
        color: "Bee",
        material: null,
        storage: null,
        ram: null,
        processor: null,
        weight: null,
        price: 130000,
        stock: 500,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lg3xv4rhfhfb1e.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        product_id: 2,
        size: null,
        color: "Black",
        material: null,
        storage: null,
        ram: null,
        processor: null,
        weight: null,
        price: 195000,
        stock: 1000,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m19dz3yr1tzw51.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Nike Air Force 1 Shoes (Product ID: 3)
      {
        product_id: 3,
        size: null,
        color: "Black",
        material: null,
        storage: null,
        ram: null,
        processor: null,
        weight: null,
        price: 164000,
        stock: 550,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvv7307sjw7v68.webp",
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
        stock: 100,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6i35r359vfrf5.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        product_id: 5,
        size: null,
        color: "Pink",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.4,
        price: 7990000,
        stock: 40,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7d613evjth8a5.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvwy7e2tgnvfc0.webp",
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
        price: 350000,
        stock: 60,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m73jqoiem060a1.webp",
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
        price: 340000,
        stock: 50,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m73jqoiem0543f.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln8j4tf1z1v743.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz9x3c5xc0ip3c.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134201-7ras8-m2m8tde94nga75@resize_w900_nl.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lylyto2re1lt31.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7reqx2wz7gja9.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvimln3ovbt959@resize_w900_nl.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m5uvca7jutyu89.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8bmoultivzi7f.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m5tq2quch2nse6.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Nintendo Switch OLED (Product ID: 17)
      {
        product_id: 17,
        size: null,
        color: "Black",
        material: "Plastic",
        storage: 64,
        ram: 4,
        processor: "NVIDIA Tegra X1",
        weight: 0.4,
        price: 7990000,
        stock: 20,
        image_url:
          "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lx3omqo1p4cl92.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2ue4kqey4e236.webp",
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
          "https://down-vn.img.susercontent.com/file/ace4360978d1e4e3be72c264eb57f837.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8bbpgq335vm63.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lygr7rf2atnl29.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Fitbit Charge 5 (Product ID: 22)
      {
        product_id: 22,
        size: null,
        color: "Pink",
        material: null,
        storage: null,
        ram: null,
        processor: null,
        weight: 0.03,
        price: 3299000,
        stock: 50,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m85613upezcyd8.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzyfzwvtqwr1e0.webp",
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
          "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvu3qfqnu4o3a3.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m26fxljj7gz64f.webp",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3fuuj8f9ju095@resize_w900_nl.webp",
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
          "https://soyacincau.com/wp-content/uploads/2023/01/230119-oneplus-11-01-1024x816.jpg",
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
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m84fi8ziva8785.webp",
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
          "https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/07/Samsung-Galaxy-Z-Flip-5-review-17.jpeg",
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
          "https://www.epic.com.mt/wp-content/uploads/2023/03/AirPods_Pro_2nd-Gen-1.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: 31,
        size: null,
        color: "Black",
        material: "Plastic",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.05,
        price: 65900,
        stock: 40,
        image_url:
          "https://down-vn.img.susercontent.com/file/sg-11134301-7rce9-lr2q6o14jgq00c@resize_w900_nl.webp",
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
          "https://th.bing.com/th/id/OIP.q1p4n69d1dsJUgq___2rkAHaHa?rs=1&pid=ImgDetMain",
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
          "https://www.aptx.com/sites/default/files/2023-03/Xperia1_IV.jpg",
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
          "https://www.bhphotovideo.com/images/images2500x2500/sony_ilce_7m3k_b_alpha_a7_iii_mirrorless_1394219.jpg",
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
          "https://th.bing.com/th/id/R.a2e19038f7980f55190f0c6a1944c58e?rik=kfHP1KnP%2bKMREA&pid=ImgRaw&r=0",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Product_Variants", null, {});
  },
};