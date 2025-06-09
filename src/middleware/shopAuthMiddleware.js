const jwt = require("../config/jwt");

const shopAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Không có token xác thực" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verifyToken(token); // dùng chung hàm decode

        if (!decoded || !decoded.roles || !decoded.roles.includes("vendor")) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc không phải shop" });
        }

        if (!decoded.id && decoded.user_id) {
            decoded.id = decoded.user_id;
        }

        req.shop = decoded;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Lỗi xác thực", error: error.message });
    }
};

module.exports = shopAuthMiddleware;
