const categoryService = require("../services/categoryService");

const handleGetAllCategories = async (req, res) => {
  try {
    console.log("Getting all categories");
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error in handleGetAllCategories:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleGetAllCategories,
};
