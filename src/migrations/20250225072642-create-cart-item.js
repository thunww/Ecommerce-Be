"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tạo bảng 'CartItems'
    await queryInterface.createTable("CartItems", {
      cart_item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Carts", // Đảm bảo rằng bảng Carts tồn tại
          key: "cart_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Đảm bảo rằng bảng Products tồn tại
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Shops", // Đảm bảo rằng bảng Shops tồn tại
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
    await queryInterface.addIndex("CartItems", ["cart_id"]);
    await queryInterface.addIndex("CartItems", ["product_id"]);
    await queryInterface.addIndex("CartItems", ["shop_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa bảng 'CartItems' khi rollback migration
    await queryInterface.dropTable("CartItems");
  },
};
