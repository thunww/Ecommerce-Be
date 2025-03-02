const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token); 

        if (!decoded) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = decoded; 
        console.log(" User decoded from token:", req.user);
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = authMiddleware;
