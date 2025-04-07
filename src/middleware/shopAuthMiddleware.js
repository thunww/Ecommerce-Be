const jwt = require("../config/jwt");

const shopAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: 'error',
                message: "Không có token xác thực shop"
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verifyShopToken(token);
        } catch (error) {
            return res.status(403).json({
                status: 'error',
                message: "Token shop không hợp lệ hoặc đã hết hạn"
            });
        }

        if (!decoded) {
            return res.status(403).json({
                status: 'error',
                message: "Token shop không hợp lệ"
            });
        }

        if (!decoded.id && decoded.shop_id) {
            decoded.id = decoded.shop_id;
        }

        req.shop = decoded;
        console.log("Shop authenticated:", req.shop);

        next();
    } catch (error) {
        console.error("Lỗi xác thực shop:", error);
        return res.status(500).json({
            status: 'error',
            message: "Lỗi server khi xác thực shop"
        });
    }
};

module.exports = shopAuthMiddleware; 