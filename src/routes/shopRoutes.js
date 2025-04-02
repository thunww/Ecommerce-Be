const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  handleGetAllShops,
  handleAssignStatusToShop,
} = require("../controllers/shopController");
const router = express.Router();

router.get(
  "/shops",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleGetAllShops
);

router.post(
  "/shops/assign-status",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleAssignStatusToShop
);

module.exports = router;
