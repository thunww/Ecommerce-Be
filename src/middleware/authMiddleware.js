const jwt = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ cookie thay vì header
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verifyToken(token);
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (!decoded) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }

    // Đảm bảo có ID người dùng
    if (!decoded.id && decoded.user_id) {
      decoded.id = decoded.user_id;
    }

    req.user = decoded;

    

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
