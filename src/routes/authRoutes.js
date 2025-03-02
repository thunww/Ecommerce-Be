const express = require("express");
const {  handleLoginUser, handleregisterUser, verifyEmail } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", handleregisterUser);
router.post("/login", handleLoginUser);
router.get('/verify-email', verifyEmail);
module.exports = router;
