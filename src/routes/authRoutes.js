const express = require("express");
const {
  handleLoginUser,
  handleregisterUser,
  verifyEmail,
  handleForgotPassword,
  handleResetPassword,
  handleLogout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", handleregisterUser);
router.post("/login", handleLoginUser);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);
router.post("/logout", handleLogout);
module.exports = router;
