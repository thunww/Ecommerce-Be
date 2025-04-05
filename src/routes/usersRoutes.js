const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleGetUserById,
  handleBanUser,
  handleUnbanUser,
  handleUpdateUser,
  handleUploadAvatar,
} = require("../controllers/usersController");

const router = express.Router();

router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleGetAllUsers
);

router.post(
  "/admin/users/assign-role",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleAssignRoleToUser
);

router.post(
  "/admin/users/remove-role",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleRemoveRoleFromUser
);

router.get(
  "/users/:userId",
  authMiddleware,
  roleMiddleware(["admin", "customer"]),
  handleGetUserById
);

router.put(
  "/admin/users/ban/",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleBanUser
);

router.put(
  "/admin/users/unban/",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleUnbanUser
);

router.put(
  "/users/:userId",
  authMiddleware,
  roleMiddleware(["customer"]),
  handleUpdateUser
);
router.post(
  "/users/upload-avatar",
  authMiddleware,
  upload.single("image"),
  handleUploadAvatar
);

module.exports = router;
