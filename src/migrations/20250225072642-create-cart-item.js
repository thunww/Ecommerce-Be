"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tạo bảng 'cart_items'
    await queryInterface.createTable("cart_items", {
      cart_item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "carts", // Đảm bảo rằng bảng carts tồn tại
          key: "cart_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Đảm bảo rằng bảng products tồn tại
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Shops", // Đảm bảo rằng bảng shops tồn tại
          key: "shop_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1, // Đảm bảo số lượng tối thiểu là 1
        },
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false, // Đảm bảo giá trị có thể null
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false, // Đảm bảo total_price luôn có giá trị
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Thêm các index để tối ưu truy vấn
    await queryInterface.addIndex("cart_items", ["cart_id"]);
    await queryInterface.addIndex("cart_items", ["product_id"]);
    await queryInterface.addIndex("cart_items", ["shop_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa bảng 'cart_items' khi rollback migration
    await queryInterface.dropTable("cart_items");
  },
};
