const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  handleGetAllShops,
  handleAssignStatusToShop,
} = require("../controllers/shopController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["admin"]), handleGetAllShops);

router.post(
  "/assign-status",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleAssignStatusToShop
);

module.exports = router;
