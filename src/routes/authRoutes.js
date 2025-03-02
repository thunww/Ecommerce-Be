const express = require("express");
const {  loginUser, handleregisterUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", handleregisterUser);
router.post("/login", loginUser);

module.exports = router;
