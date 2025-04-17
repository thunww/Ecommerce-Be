// seeders/[timestamp]-product-reviews.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Product_Reviews", [
      {
        review_id: 1,
        product_id: 1,
        user_id: 3,
        rating: 5,
        comment: "Amazing product! The quality exceeded my expectations.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7r98o-lvt4vrwx7gt713.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 2,
        product_id: 2,
        user_id: 5,
        rating: 4,
        comment: "Good value for the price. I would buy again.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-m5yg0uvwo52w8d.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 3,
        product_id: 1,
        user_id: 2,
        rating: 3,
        comment: "Decent product, but delivery was a bit slow.",
        images: null,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 4,
        product_id: 3,
        user_id: 7,
        rating: 5,
        comment: "Highly recommend this product! Great experience.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7r98o-lw13ppi642c9ca.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 5,
        product_id: 2,
        user_id: 1,
        rating: 2,
        comment: "Not what I expected. Quality could be improved.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7r98o-lqo8j3yykxjmc8.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 6,
        product_id: 2,
        user_id: 4,
        rating: 4,
        comment: "Product was good, but packaging was damaged.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-m4baor47lkavd8.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 7,
        product_id: 3,
        user_id: 6,
        rating: 5,
        comment: "Absolutely love it! Will purchase again soon.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7qukw-lfuq55gcj6d3e6.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 8,
        product_id: 3,
        user_id: 8,
        rating: 1,
        comment: "Very disappointed. The product was defective.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7qukw-lfjmvz2x2ulxb2.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 9,
        product_id: 1,
        user_id: 9,
        rating: 3,
        comment: "It's okay, but nothing special. Expected better.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-7ra0g-m69baqwghb1y0b.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        review_id: 10,
        product_id: 1,
        user_id: 10,
        rating: 5,
        comment: "Fantastic product! Worth every penny.",
        images:
          "https://down-vn.img.susercontent.com/file/vn-11134103-23030-otwiux4pwfov86.webp",
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Product_Reviews", null, {});
  },
};
