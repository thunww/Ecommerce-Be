const { Category } = require("../models");

const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      order: [["created_at", "DESC"]],
    });
    return categories;
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    throw new Error("Không thể lấy danh sách danh mục");
  }
};

module.exports = {
  getAllCategories,
};
