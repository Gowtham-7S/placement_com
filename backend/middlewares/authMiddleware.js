const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const constants = require('../config/constants');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(constants.HTTP_UNAUTHORIZED).json({
        success: false,
        message: 'No authorization header provided',
        error: 'MISSING_AUTH_HEADER',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(constants.HTTP_UNAUTHORIZED).json({
        success: false,
        message: 'No token provided',
        error: 'MISSING_TOKEN',
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(constants.HTTP_UNAUTHORIZED).json({
          success: false,
          message: 'Invalid or expired token',
          error: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        });
      }

      // Attach user data to request
      req.user = decoded;
      req.userId = decoded.id;
      req.userRole = decoded.role;

      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(constants.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
