const Drive = require('../models/Drive');
const Company = require('../models/Company');
const { AppError } = require('../middlewares/errorHandler');
const constants = require('../config/constants');

/**
 * Drive Service
 * Handles interview drive management operations
 */
class DriveService {
  /**
   * Get all drives with filtering
   */
  static async getAllDrives(limit = 20, offset = 0, filters = {}) {
    try {
      return await Drive.getAll(limit, offset, filters);
    } catch (error) {
      throw new Error(`Get drives error: ${error.message}`);
    }
  }

  /**
   * Get drive by ID
   */
  static async getDriveById(id) {
    try {
      const drive = await Drive.findById(id);
      if (!drive) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'DRIVE_NOT_FOUND'
        );
      }
      return drive;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Get drive error: ${error.message}`);
    }
  }

  /**
   * Create new drive
   */
  static async createDrive(driveData, userId) {
    try {
      // Validate company exists to prevent foreign key error
      const company = await Company.findById(driveData.company_id);
      if (!company) {
        throw new AppError(
          'Company not found',
          constants.HTTP_NOT_FOUND || 404,
          'COMPANY_NOT_FOUND'
        );
      }

      // Add creator ID to data
      const data = { ...driveData, created_by: userId };
      return await Drive.create(data);
    } catch (error) {
      throw new Error(`Create drive error: ${error.message}`);
    }
  }

  /**
   * Update drive
   */
  static async updateDrive(id, updates) {
    try {
      const drive = await Drive.update(id, updates);
      if (!drive) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'DRIVE_NOT_FOUND'
        );
      }
      return drive;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Update drive error: ${error.message}`);
    }
  }

  /**
   * Delete drive
   */
  static async deleteDrive(id) {
    try {
      const result = await Drive.delete(id);
      if (!result) {
        throw new AppError(
          constants.ERROR_NOT_FOUND,
          constants.HTTP_NOT_FOUND,
          'DRIVE_NOT_FOUND'
        );
      }
      return { success: true, message: 'Drive deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new Error(`Delete drive error: ${error.message}`);
    }
  }
}

module.exports = DriveService;