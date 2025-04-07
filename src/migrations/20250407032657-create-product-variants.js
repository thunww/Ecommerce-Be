module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Product_Variants", {
      variant_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "product_id",
        },
        onDelete: "CASCADE",
      },
      size: {
        type: Sequelize.STRING(50),
        allowNull: true, // Áp dụng cho sản phẩm có kích cỡ (quần áo, giày)
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: true, // Áp dụng cho các sản phẩm có màu sắc
      },
      material: {
        type: Sequelize.STRING(50),
        allowNull: true, // Áp dụng cho sản phẩm có chất liệu (quần áo, giày)
      },
      storage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ram: {
        type: Sequelize.INTEGER,
        allowNull: true, // Áp dụng cho sản phẩm có RAM (máy tính, điện thoại)
      },
      processor: {
        type: Sequelize.STRING(100),
        allowNull: true, // Áp dụng cho sản phẩm có bộ xử lý (laptop, điện thoại)
      },
      weight: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true, // Trọng lượng của phiên bản sản phẩm
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false, // Giá của phiên bản sản phẩm
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // Số lượng tồn kho cho phiên bản này
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Product_Variants");
  },
};
