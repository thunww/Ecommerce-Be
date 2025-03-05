// Trong authRouter.js (hoặc file route tương ứng)
const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/customer", authMiddleware, roleMiddleware(["customer"]), (req, res) => {
    res.json({ message: "Welcome Customer!" });
});
router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});
router.get("/vendor", authMiddleware, roleMiddleware(["vendor"]), (req, res) => {
    res.json({ message: "Welcome vendor!" });
});


module.exports = router;
