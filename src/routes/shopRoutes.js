const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getOrderedProducts } = require("../controllers/shopController");
const {
  handleGetAllShops,
  handleAssignStatusToShop,
  handleGetShopById,
  handleGetShopProducts,
  handleGetMyShop,
} = require("../controllers/shopController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["admin"]), handleGetAllShops);
router.get(
  "/:shopId/ordered-products",
  authMiddleware,
  roleMiddleware(["admin", "vendor"]),
  getOrderedProducts
);

router.get("/:shopId", handleGetShopById);

router.get(
  "/:shopId/products",
  authMiddleware,
  roleMiddleware(["admin", "vendor"]),
  handleGetShopProducts
);

router.post(
  "/assign-status",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleAssignStatusToShop
);


module.exports = router;
