const express = require("express");
const {
  handleLoginUser,
  handleregisterUser,
  verifyEmail,
  handleForgotPassword,
  handleResetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", handleregisterUser);
router.post("/login", handleLoginUser);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);

// Thêm route logout, yêu cầu authentication
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const result = await require("../services/authService").logout(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
