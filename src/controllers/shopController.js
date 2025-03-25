const { getAllShops, assingStatusToShop } = require("../services/shopService");

const handleGetAllShops = async (req, res) => {
  try {
    const shops = await getAllShops();
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleAssignStatusToShop = async (req, res) => {
  try {
    const { shopId, status } = req.body;
    const result = await assingStatusToShop(shopId, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  handleGetAllShops,
  handleAssignStatusToShop,
};
