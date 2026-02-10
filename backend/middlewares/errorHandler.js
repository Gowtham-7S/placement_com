const constants = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized response
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || constants.HTTP_INTERNAL_SERVER_ERROR;
  const message = err.message || constants.ERROR_SERVER_ERROR;

  // Log the error
  logger.error({
    status,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Send error response
  res.status(status).json({
    success: false,
    message,
    error: err.code || 'ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res) => {
  res.status(constants.HTTP_NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    error: 'NOT_FOUND',
    path: req.path,
  });
};

/**
 * Create Custom Error
 */
class AppError extends Error {
  constructor(message, status = constants.HTTP_INTERNAL_SERVER_ERROR, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
};
