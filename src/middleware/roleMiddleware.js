const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - No user found" });
      }
  
      // Kiểm tra nếu ít nhất một role của user thuộc allowedRoles
      const userRoles = req.user.roles || []; // Mặc định là mảng rỗng nếu không có roles
      const hasPermission = userRoles.some(role => allowedRoles.includes(role));
  
      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden - You do not have permission" });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;
  