const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleDeleteUser,
  handleUpdateUser,
  handleCreateUser
} = require("../controllers/adminController");

const router = express.Router();


router.get("/users", authMiddleware, roleMiddleware(["admin"]), handleGetAllUsers);

router.post("/users/assign-role", authMiddleware, roleMiddleware(["admin"]), handleAssignRoleToUser);

router.post("/users/remove-role", authMiddleware, roleMiddleware(["admin"]), handleRemoveRoleFromUser);

router.delete("/users/:userId", authMiddleware, roleMiddleware(["admin"]), handleDeleteUser);

router.put("/users/:userId", authMiddleware, roleMiddleware(["admin"]), handleUpdateUser);

router.post("/users", authMiddleware, roleMiddleware(["admin"]), handleCreateUser);



module.exports = router;
