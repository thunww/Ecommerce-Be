const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class BlacklistedToken extends Model {}

BlacklistedToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "BlacklistedToken",
    tableName: "blacklisted_tokens",
    timestamps: true,
    underscored: true,
  }
);

// Tạo index cho token để tìm kiếm nhanh hơn
BlacklistedToken.sync({ force: true }).then(() => {
  console.log("Bảng blacklisted_tokens đã được tạo/cập nhật");
});

module.exports = BlacklistedToken;
