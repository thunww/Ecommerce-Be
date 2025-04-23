const Category = require("../models/category");

const categoryService = {
  // Lấy tất cả danh mục
  getAllCategories: async () => {
    try {
      const categories = await Category.findAll();
      return {
        success: true,
        message: "Fetched categories successfully",
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch categories",
        data: null,
      };
    }
  },

  // Lấy 1 danh mục theo ID
  getCategoryById: async (id) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return {
          success: false,
          message: "Category not found",
          data: null,
        };
      }
      return {
        success: true,
        message: "Fetched category successfully",
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch category",
        data: null,
      };
    }
  },

  // Tạo mới danh mục
  createCategory: async (categoryData) => {
    try {
      const newCategory = await Category.create(categoryData);
      return {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to create category",
        data: null,
      };
    }
  },

  // Cập nhật danh mục
  updateCategory: async (id, updateData) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return {
          success: false,
          message: "Category not found",
          data: null,
        };
      }
      await category.update(updateData);
      return {
        success: true,
        message: "Category updated successfully",
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update category",
        data: null,
      };
    }
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return {
          success: false,
          message: "Category not found",
          data: null,
        };
      }
      await category.destroy();
      return {
        success: true,
        message: "Category deleted successfully",
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete category",
        data: null,
      };
    }
  },
};

module.exports = categoryService;
