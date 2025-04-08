"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {



    await queryInterface.createTable("Carts", {
      cart_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
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

    // Thêm index cho user_id để tối ưu truy vấn
    await queryInterface.addIndex("Carts", ["user_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Carts");
  },
};
