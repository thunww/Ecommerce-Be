const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleGetUserById,
  handleBanUser,
  handleUnbanUser,
} = require("../controllers/adminController");

const router = express.Router();


router.get("/users", authMiddleware, roleMiddleware(["admin"]), handleGetAllUsers);

router.post("/users/assign-role", authMiddleware, roleMiddleware(["admin"]), handleAssignRoleToUser);

router.post("/users/remove-role", authMiddleware, roleMiddleware(["admin"]), handleRemoveRoleFromUser);

router.get("/users/:userId", authMiddleware, roleMiddleware(["admin"]), handleGetUserById);

router.put("/users/ban/", authMiddleware, roleMiddleware(["admin"]), handleBanUser );

router.put("/users/unban/", authMiddleware, roleMiddleware(["admin"]), handleUnbanUser )

module.exports = router;
