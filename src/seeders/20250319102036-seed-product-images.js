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
        product_id: 12,
        image_url:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/products/floorcare/sticks/v15-detect/pdp/gallery/Dyson-V15-Direct-HeroWithNasties-Core-LB.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920",
        is_primary: true,
        uploaded_at: new Date(),
      },
      {
        product_id: 13,
        image_url:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/o/soundlink_revolve_plus_lux_gray_ec_02.jpg",
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
        product_id: 11,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzBidAvBQJTlVBHM27XLTUKjIpm2tya8BYg2gxelHHg7gLBlRl87gezWk&s",
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
