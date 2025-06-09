module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      // product_code: {
      //   type: Sequelize.STRING(50),
      //   allowNull: true, // Cho phép null ban đầu để hỗ trợ dữ liệu cũ
      //   unique: true, // Đảm bảo mã đơn hàng là duy nhất
      // },
      product_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      discount: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      weight: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true,
      },
      dimensions: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "inactive"),
        allowNull: false,
        defaultValue: "pending",
      },
      average_rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      review_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Shops",
          key: "shop_id",
        },
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "category_id",
        },
        onDelete: "SET NULL",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Products");
  },
};