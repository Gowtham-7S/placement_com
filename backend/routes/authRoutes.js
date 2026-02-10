const express = require('express');
const AuthController = require('../controllers/AuthController');
const { validators, handleValidationErrors } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Authentication Routes
 */

// Register
router.post(
  '/register',
  validators.registerValidation,
  handleValidationErrors,
  AuthController.register
);

// Login
router.post(
  '/login',
  validators.loginValidation,
  handleValidationErrors,
  AuthController.login
);

// Get profile (requires auth)
router.get('/me', authMiddleware, AuthController.getProfile);

// Update profile (requires auth)
router.put(
  '/profile',
  authMiddleware,
  validators.updateProfileValidation,
  handleValidationErrors,
  AuthController.updateProfile
);

// Logout (requires auth)
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
