const { pool } = require('../config/database');
const Experience = require('../models/Experience');
const Round = require('../models/Round');
const Question = require('../models/Question');
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
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Create Experience (Map snake_case req data to camelCase model params)
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
        interviewDuration: experienceData.interview_duration,
        overallDifficulty: experienceData.overall_difficulty,
        overallFeedback: experienceData.overall_feedback,
        confidenceLevel: experienceData.confidence_level
      }, client);

      // 2. Create Rounds & Questions
      if (experienceData.rounds && Array.isArray(experienceData.rounds)) {
        for (const roundData of experienceData.rounds) {
          const round = await Round.create({
            experienceId: experience.id,
            roundNumber: roundData.round_number,
            roundType: roundData.round_type,
            durationMinutes: roundData.duration_minutes,
            result: roundData.result,
            roundDate: roundData.round_date,
            topics: roundData.topics,
            questions: roundData.questions, // Just for JSON storage if model uses it
            difficultyLevel: roundData.difficulty_level,
            problemStatement: roundData.problem_statement,
            approachUsed: roundData.approach_used,
            codeSnippet: roundData.code_snippet,
            tipsAndInsights: roundData.tips_and_insights,
            interviewerFeedback: roundData.interviewer_feedback,
            skillsTested: roundData.skills_tested
          }, client);

          if (roundData.questions_list && Array.isArray(roundData.questions_list)) {
            for (const questionData of roundData.questions_list) {
              await Question.create({
                roundId: round.id,
                questionText: questionData.question_text,
                category: questionData.category,
                subcategory: questionData.subcategory,
                difficulty: questionData.difficulty,
                answerProvided: questionData.answer_provided,
                answerQuality: questionData.answer_quality,
                isCommon: questionData.is_common
              }, client);
            }
          }
        }
      }

      await client.query('COMMIT');
      return experience;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Submit experience error: ${error.message}`);
    } finally {
      client.release();
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
