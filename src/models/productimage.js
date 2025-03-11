const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class ProductImage extends Model {}

ProductImage.init(
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products", // Đảm bảo trùng tên bảng thật trong DB
        key: "product_id", // Đảm bảo trùng với khóa chính của Product
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "ProductImage",
    tableName: "Product_Images",
    timestamps: false, // Nếu không dùng createdAt, updatedAt
  }
);

module.exports = ProductImage;
