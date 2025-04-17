const categoryService = require("../services/categoryService");

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await categoryService.getCategoryById(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// Tạo mới danh mục
const createCategory = async (req, res) => {
  const categoryData = req.body;
  try {
    const result = await categoryService.createCategory(categoryData);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const result = await categoryService.updateCategory(id, updateData);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await categoryService.deleteCategory(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
