"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Product_Images", [
      {
        product_id: 1,
        image_url:
          "https://dienmaythienphu.vn/wp-content/uploads/2021/10/gYF67a.jpg",
        is_primary: true,
        uploaded_at: new Date(),
      },
      {
        product_id: 2,
        image_url:
          "https://th.bing.com/th/id/OIP.cxow4qQOo_KGVaNvfU9WTQHaDt?rs=1&pid=ImgDetMain",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 3,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltnqk8e33q4tf2.webp",
        is_primary: true,
        uploaded_at: new Date(),
      },
      {
        product_id: 4,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltnqk8e33q4tf2.webp",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 5,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwliais1yv2x93.webp",
        is_primary: true,
        uploaded_at: new Date(),
      },
      {
        product_id: 6,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nkerg1c.webp",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 7,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llm05p5nq118f5.webp",
        is_primary: true,
        uploaded_at: new Date(),
      },
      {
        product_id: 8,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7iqwashoz4o19.webp",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 9,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lv69p2xficnu6d.webp",
        is_primary: true,
        uploaded_at: new Date(),
      },
      {
        product_id: 10,
        image_url:
          "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3i807hmm9j09e.webp",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 1,
        image_url: "https://example.com/image11.jpg",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 2,
        image_url: "https://example.com/image12.jpg",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 3,
        image_url: "https://example.com/image13.jpg",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 1,
        image_url: "https://example.com/image14.jpg",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 4,
        image_url: "https://example.com/image15.jpg",
        is_primary: false,
        uploaded_at: new Date(),
      },
      {
        product_id: 10,
        image_url: "https://example.com/image16.jpg",
        is_primary: false,
        uploaded_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Product_Images", null, {});
  },
};
