const Experience = require('../models/Experience');
const { AppError } = require('../middlewares/errorHandler');
const constants = require('../config/constants');

/**
 * Experience Service
 * Handles interview experience submission and management
 */
class ExperienceService {
  /**
   * Submit new experience
   */
  static async submitExperience(userId, experienceData) {
    try {
      const experience = await Experience.create({
        userId,
        driveId: experienceData.drive_id,
        companyName: experienceData.company_name,
        roleApplied: experienceData.role_applied,
        result: experienceData.result,
        selected: experienceData.selected,
        offerReceived: experienceData.offer_received,
        ctcOffered: experienceData.ctc_offered,
        isAnonymous: experienceData.is_anonymous || false,
      });

      return experience;
    } catch (error) {
      throw new Error(`Submit experience error: ${error.message}`);
    }
  }

  /**
   * Get user's experiences
   */
  static async getUserExperiences(userId, limit = 20, offset = 0) {
    try {
      return await Experience.getByUserId(userId, limit, offset);
    } catch (error) {
      throw new Error(`Get experiences error: ${error.message}`);
    }
  }

  /**
   * Get experience by ID
   */
  static async getExperienceById(id) {
    try {
      const experience = await Experience.findById(id);
      if (!experience) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'EXPERIENCE_NOT_FOUND'
        );
      }

      return experience;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Get experience error: ${error.message}`);
    }
  }

  /**
   * Update experience (Student only - own submissions)
   */
  static async updateExperience(userId, experienceId, updates) {
    try {
      const experience = await Experience.findById(experienceId);
      if (!experience) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'EXPERIENCE_NOT_FOUND'
        );
      }

      // Check if user is the owner
      if (experience.user_id !== userId) {
        throw new AppError(
          constants.ERROR_FORBIDDEN,
          constants.HTTP_FORBIDDEN,
          'NOT_OWNER'
        );
      }

      // Can only update pending submissions
      if (experience.approval_status !== 'pending') {
        throw new AppError(
          'Cannot update approved or rejected submissions',
          constants.HTTP_FORBIDDEN,
          'CANNOT_UPDATE'
        );
      }

      return await Experience.update(experienceId, updates);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Update experience error: ${error.message}`);
    }
  }

  /**
   * Get pending submissions (Admin only)
   */
  static async getPendingSubmissions(limit = 20, offset = 0) {
    try {
      return await Experience.getByApprovalStatus('pending', limit, offset);
    } catch (error) {
      throw new Error(`Get pending submissions error: ${error.message}`);
    }
  }

  /**
   * Approve submission (Admin only)
   */
  static async approveSubmission(experienceId) {
    try {
      const experience = await Experience.findById(experienceId);
      if (!experience) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'EXPERIENCE_NOT_FOUND'
        );
      }

      return await Experience.updateApprovalStatus(experienceId, 'accepted');
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Approve submission error: ${error.message}`);
    }
  }

  /**
   * Reject submission (Admin only)
   */
  static async rejectSubmission(experienceId) {
    try {
      const experience = await Experience.findById(experienceId);
      if (!experience) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'EXPERIENCE_NOT_FOUND'
        );
      }

      return await Experience.updateApprovalStatus(experienceId, 'rejected');
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Reject submission error: ${error.message}`);
    }
  }
}

module.exports = ExperienceService;
