module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Product_Variants", [
      // Variants for iPhone 15 Pro Max (Product ID: 1)
      {
        product_id: 1,
        size: null, // No size variant for phone
        color: "Space Gray",
        material: "Aluminum",
        storage: 128, // Storage variant
        ram: 6, // RAM for phone
        processor: "A17 Pro chip",
        weight: 0.3,
        price: 32990000,
        stock: 50,
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
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for MacBook Pro M3 (Product ID: 2)
      {
        product_id: 2,
        size: "16-inch", // Size variant
        color: "Space Gray",
        material: "Aluminum",
        storage: 512,
        ram: 16,
        processor: "M3 chip",
        weight: 1.5,
        price: 45990000,
        stock: 20,
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
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for Nike Air Force 1 Shoes (Product ID: 3)
      {
        product_id: 3,
        size: "10 US", // Shoe size
        color: "White",
        material: "Leather",
        storage: null,
        ram: null,
        processor: null,
        weight: 0.8,
        price: 2990000,
        stock: 50,
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
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Variants for LG 55-inch OLED TV (Product ID: 6)
      {
        product_id: 6,
        size: "55-inch", // Size variant
        color: "Black",
        material: "OLED",
        storage: null,
        ram: null,
        processor: null,
        weight: 18.0,
        price: 27990000,
        stock: 15,
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
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Product_Variants", null, {});
  },
};
