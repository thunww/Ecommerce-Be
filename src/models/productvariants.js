const { Model, DataTypes, Sequelize } = require("sequelize"); // Đảm bảo đã nhập Sequelize

// Tham chiếu sequelize từ config
const sequelize = require("../config/database");

class ProductVariant extends Model {}

ProductVariant.init(
  {
    variant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Tên bảng mà ProductVariant tham chiếu
        key: "product_id",
      },
      onDelete: "CASCADE",
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    storage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ram: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    processor: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true, // Đường dẫn hình ảnh cho phiên bản sản phẩm
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Sử dụng Sequelize.literal
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: Sequelize.literal(
      //   "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      // ),
    },
  },
  {
    sequelize,
    modelName: "ProductVariant",
    tableName: "Product_Variants",
    timestamps: true, // Bật tính năng timestamps để tự động sử dụng createdAt và updatedAt
    createdAt: "created_at", // Đổi tên trường timestamp thành created_at
    updatedAt: "updated_at", // Đổi tên trường timestamp thành updated_at
  }
);

module.exports = ProductVariant;
