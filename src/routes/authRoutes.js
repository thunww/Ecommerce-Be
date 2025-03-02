const express = require("express");
const {  handleLoginUser, handleregisterUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", handleregisterUser);
router.post("/login", handleLoginUser);

module.exports = router;
