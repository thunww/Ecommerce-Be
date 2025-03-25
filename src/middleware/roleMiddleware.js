const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Log để debug
    console.log("=== Role Middleware ===");
    console.log("Required roles:", roles);
    console.log("User from req:", req.user);

    try {
      // Kiểm tra nếu không có thông tin user từ middleware auth
      if (!req.user) {
        console.log("No user information found");
        return res
          .status(401)
          .json({ message: "Unauthorized: No user information" });
      }

      // Lấy role của người dùng từ req.user
      const userRoles = req.user.roles || [];
      console.log("User roles:", userRoles);

      // Kiểm tra xem người dùng có quyền truy cập không
      const hasRequiredRole = roles.some((role) => userRoles.includes(role));
      console.log("Has required role:", hasRequiredRole);

      if (!hasRequiredRole) {
        console.log("Access denied - user does not have required role");
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      // Cho phép truy cập
      console.log("Role check passed - access granted");
      next();
    } catch (error) {
      console.error("Error in role middleware:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = roleMiddleware;
