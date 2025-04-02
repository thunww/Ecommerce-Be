const { verifyToken } = require("../config/jwt");
const BlacklistedToken = require("../models/blacklistedToken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Kiểm tra token có trong blacklist không
    const blacklistedToken = await BlacklistedToken.findOne({
      where: { token: token },
    });

    if (blacklistedToken) {
      return res.status(401).json({ message: "Token đã bị vô hiệu hóa" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    req.user = decoded;
    //console.log("User authenticated:", req.user);

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
