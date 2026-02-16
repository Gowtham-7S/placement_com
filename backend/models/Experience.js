const { pool } = require('../config/database');

/**
 * Experience Model
 */
class Experience {
  static async findById(id) {
    try {
      const query = `
        SELECT id, user_id, drive_id, company_name, role_applied, result, selected, 
               offer_received, ctc_offered, is_anonymous, approval_status, submitted_at, 
               approved_at, created_at
        FROM experiences WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding experience: ${error.message}`);
    }
  }

  static async create(experienceData, client = pool) {
    try {
      const {
        userId, driveId, companyName, roleApplied, result: interviewResult, offerReceived, ctcOffered, isAnonymous,
        interviewDuration, overallDifficulty, overallFeedback, confidenceLevel
      } = experienceData;

      const query = `
        INSERT INTO experiences (
          user_id, drive_id, company_name, role_applied, result, 
          offer_received, ctc_offered, is_anonymous, approval_status, 
          interview_duration, overall_difficulty, overall_feedback, confidence_level,
          submitted_at, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10, $11, $12, NOW(), NOW(), NOW())
        RETURNING id, company_name, role_applied, approval_status, submitted_at
      `;

      const result = await client.query(query, [
        userId, driveId, companyName, roleApplied, interviewResult,
        offerReceived || false, ctcOffered || null, isAnonymous || false,
        interviewDuration, overallDifficulty, overallFeedback, confidenceLevel
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating experience: ${error.message}`);
    }
  }

  static async getByUserId(userId, limit = 20, offset = 0) {
    try {
      const countQuery = 'SELECT COUNT(*) as total FROM experiences WHERE user_id = $1';
      const dataQuery = `
        SELECT id, company_name, role_applied, result, approval_status, submitted_at 
        FROM experiences WHERE user_id = $1 
        ORDER BY submitted_at DESC LIMIT $2 OFFSET $3
      `;

      const countResult = await pool.query(countQuery, [userId]);
      const dataResult = await pool.query(dataQuery, [userId, limit, offset]);

      return {
        total: parseInt(countResult.rows[0].total),
        data: dataResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching experiences: ${error.message}`);
    }
  }

  static async getByApprovalStatus(status, limit = 20, offset = 0) {
    try {
      const countQuery = 'SELECT COUNT(*) as total FROM experiences WHERE approval_status = $1';
      const dataQuery = `
        SELECT id, user_id, company_name, role_applied, result, approval_status, submitted_at 
        FROM experiences WHERE approval_status = $1 
        ORDER BY submitted_at DESC LIMIT $2 OFFSET $3
      `;

      const countResult = await pool.query(countQuery, [status]);
      const dataResult = await pool.query(dataQuery, [status, limit, offset]);

      return {
        total: parseInt(countResult.rows[0].total),
        data: dataResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching experiences by status: ${error.message}`);
    }
  }

  static async updateApprovalStatus(id, status, approvedBy, comment = null) {
    try {
      const query = `
        UPDATE experiences 
        SET approval_status = $1, approved_by = $2, approved_at = NOW(), admin_comments = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, approval_status, approved_at
      `;

      const result = await pool.query(query, [status, approvedBy, comment || null, id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error updating approval status: ${error.message}`);
    }
  }

  static async update(id, updates) {
    try {
      const allowedFields = ['result', 'selected', 'offer_received', 'ctc_offered', 'overall_feedback', 'overall_difficulty', 'confidence_level'];
      const updateKeys = Object.keys(updates).filter((key) => allowedFields.includes(key));

      if (updateKeys.length === 0) return this.findById(id);

      let query = 'UPDATE experiences SET ';
      const values = [];
      let paramIndex = 1;

      updateKeys.forEach((key, index) => {
        query += `${key} = $${paramIndex}`;
        if (index < updateKeys.length - 1) query += ', ';
        values.push(updates[key]);
        paramIndex++;
      });

      query += ', updated_at = NOW() WHERE id = $' + paramIndex;
      values.push(id);
      query += ' RETURNING id, approval_status';

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error updating experience: ${error.message}`);
    }
  }
}

module.exports = Experience;
