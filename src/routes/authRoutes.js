const express = require("express");
const {  handleLoginUser, handleregisterUser, verifyEmail, handleForgotPassword, handleResetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", handleregisterUser);
router.post("/login", handleLoginUser);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password',handleForgotPassword)
router.post('/reset-password',handleResetPassword);
    
module.exports = router;
