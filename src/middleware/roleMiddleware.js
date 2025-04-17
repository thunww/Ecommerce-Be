const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No roles found.'
      });
    }

    const hasRole = roles.some(role => req.user.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have the required role.'
      });
    }

    next();
  };
};

module.exports = roleMiddleware;