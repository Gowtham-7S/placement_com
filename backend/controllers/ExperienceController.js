const ExperienceService = require('../services/ExperienceService');
const constants = require('../config/constants');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/queryUtils');

/**
 * Experience Controller
 */
class ExperienceController {
  /**
   * Submit experience
   * POST /api/student/experience
   */
  static async submitExperience(req, res, next) {
    try {
      const experience = await ExperienceService.submitExperience(req.userId, req.body);

      res.status(constants.HTTP_CREATED).json({
        success: true,
        message: constants.SUCCESS_DATA_CREATED,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's experiences
   * GET /api/student/experiences
   */
  static async getUserExperiences(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { limit: limitNum, offset } = getPaginationParams(page, limit);

      const result = await ExperienceService.getUserExperiences(req.userId, limitNum, offset);

      res.status(constants.HTTP_OK).json({
        success: true,
        ...formatPaginatedResponse(result.data, result.total, page, limitNum),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get experience by ID
   * GET /api/student/experience/:id
   */
  static async getExperience(req, res, next) {
    try {
      const experience = await ExperienceService.getExperienceById(req.params.id);

      res.status(constants.HTTP_OK).json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update experience
   * PUT /api/student/experience/:id
   */
  static async updateExperience(req, res, next) {
    try {
      const experience = await ExperienceService.updateExperience(req.userId, req.params.id, req.body);

      res.status(constants.HTTP_OK).json({
        success: true,
        message: constants.SUCCESS_DATA_UPDATED,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending submissions (Admin only)
   * GET /api/admin/submissions/pending
   */
  static async getPendingSubmissions(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { limit: limitNum, offset } = getPaginationParams(page, limit);

      const result = await ExperienceService.getPendingSubmissions(limitNum, offset);

      res.status(constants.HTTP_OK).json({
        success: true,
        ...formatPaginatedResponse(result.data, result.total, page, limitNum),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve submission (Admin only)
   * POST /api/admin/submissions/:id/approve
   */
  static async approveSubmission(req, res, next) {
    try {
      const result = await ExperienceService.approveSubmission(
        req.params.id,
        req.userId,
        req.body.comment
      );

      res.status(constants.HTTP_OK).json({
        success: true,
        message: 'Submission approved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject submission (Admin only)
   * POST /api/admin/submissions/:id/reject
   */
  static async rejectSubmission(req, res, next) {
    try {
      const result = await ExperienceService.rejectSubmission(
        req.params.id,
        req.userId,
        req.body.reason
      );

      res.status(constants.HTTP_OK).json({
        success: true,
        message: 'Submission rejected successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExperienceController;
