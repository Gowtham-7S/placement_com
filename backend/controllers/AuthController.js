const AuthService = require('../services/AuthService');
const constants = require('../config/constants');

/**
 * Authentication Controller
 */
class AuthController {
  /**
   * Register user
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);

      res.status(constants.HTTP_CREATED).json({
        success: true,
        message: constants.SUCCESS_REGISTERED,
        data: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);

      res.status(constants.HTTP_OK).json({
        success: true,
        message: constants.SUCCESS_LOGIN,
        data: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile
   * GET /api/auth/me
   */
  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserProfile(req.userId);

      res.status(constants.HTTP_OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateProfile(req.userId, req.body);

      res.status(constants.HTTP_OK).json({
        success: true,
        message: constants.SUCCESS_DATA_UPDATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      // Token is invalidated on client side
      // Server-side token blacklisting can be added if needed

      res.status(constants.HTTP_OK).json({
        success: true,
        message: constants.SUCCESS_LOGOUT,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
