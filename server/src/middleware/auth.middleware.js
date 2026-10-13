const jwt = require('jsonwebtoken');

// Secret key for JWT verification (from .env or fallback default)
const JWT_SECRET = process.env.JWT_SECRET || 'inventory_system_super_secret_key';

//Middleware to verify the Token sa Authorization header
 
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Get token from 'Bearer <TOKEN>'
  const token = authHeader && authHeader.split(' ')[1];

  // 1. If there's no token received (401 Unauthorized)
  if (!token) {
    return res.status(401).json({
      type: "https://example.com/errors/unauthorized",
      title: "Unauthorized",
      status: 401,
      detail: "Authentication token is missing. Please provide a valid Bearer token.",
      instance: req.originalUrl
    });
  }

  // 2. Verify Token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // If the token is expired or invalid (403 Forbidden)
      return res.status(403).json({
        type: "https://example.com/errors/forbidden",
        title: "Forbidden",
        status: 403,
        detail: "The provided authentication token is invalid or has expired.",
        instance: req.originalUrl
      });
    }

    // The decoded user data will be included in the request object.
    req.user = user;
    next();
  });
};

/**
 * Optional Middleware: Role-Based Access Control (e.g., Admin, Faculty, Staff)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        type: "https://example.com/errors/forbidden",
        title: "Forbidden",
        status: 403,
        detail: "You do not have the required permissions to access this resource.",
        instance: req.originalUrl
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
