const { pool } = require('../config/database');

/**
 * Drive Model
 */
class Drive {
  static async findById(id) {
    try {
      const query = `
        SELECT d.id, d.company_id, c.name as company_name, d.role_name, d.ctc_min, d.ctc_max, 
               d.interview_date, d.registration_deadline, d.total_positions, d.filled_positions,
               d.round_count, d.drive_status, d.requirements, d.eligible_batches, d.location, 
               d.mode, d.drive_details, d.created_at
        FROM drives d
        JOIN companies c ON d.company_id = c.id
        WHERE d.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding drive: ${error.message}`);
    }
  }

  static async create(driveData) {
    try {
      const {
        company_id, role_name, ctc_min, ctc_max, interview_date, registration_deadline,
        total_positions, round_count, requirements, eligible_batches, location, mode,
        created_by
      } = driveData;

      const query = `
        INSERT INTO drives (company_id, role_name, ctc_min, ctc_max, interview_date, 
                          registration_deadline, total_positions, round_count, 
                          requirements, eligible_batches, location, mode, created_by, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        RETURNING id, company_id, role_name, interview_date, drive_status
      `;

      const result = await pool.query(query, [
        company_id, role_name, ctc_min || null, ctc_max || null, interview_date,
        registration_deadline || null, total_positions || null, round_count || null,
        requirements || null, eligible_batches || null, location || null, mode || 'online',
        created_by || null
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating drive: ${error.message}`);
    }
  }

  static async getByCompanyId(companyId, limit = 20, offset = 0) {
    try {
      const countQuery = 'SELECT COUNT(*) as total FROM drives WHERE company_id = $1 AND drive_status != $2';
      const dataQuery = `
        SELECT id, company_id, role_name, ctc_min, ctc_max, interview_date, drive_status 
        FROM drives WHERE company_id = $1 AND drive_status != $2
        ORDER BY interview_date DESC LIMIT $3 OFFSET $4
      `;

      const countResult = await pool.query(countQuery, [companyId, 'cancelled']);
      const dataResult = await pool.query(dataQuery, [companyId, 'cancelled', limit, offset]);

      return {
        total: parseInt(countResult.rows[0].total),
        data: dataResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching drives: ${error.message}`);
    }
  }

  static async getUpcoming(limit = 20, offset = 0) {
    try {
      const countQuery = 'SELECT COUNT(*) as total FROM drives WHERE drive_status IN ($1, $2)';
      const dataQuery = `
        SELECT id, company_id, role_name, ctc_min, ctc_max, interview_date, mode 
        FROM drives WHERE drive_status IN ($1, $2)
        ORDER BY interview_date ASC LIMIT $3 OFFSET $4
      `;

      const countResult = await pool.query(countQuery, ['upcoming', 'ongoing']);
      const dataResult = await pool.query(dataQuery, ['upcoming', 'ongoing', limit, offset]);

      return {
        total: parseInt(countResult.rows[0].total),
        data: dataResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching upcoming drives: ${error.message}`);
    }
  }

  static async update(id, updates) {
    try {
      const allowedFields = ['role_name', 'ctc_min', 'ctc_max', 'drive_status', 'filled_positions'];
      const updateKeys = Object.keys(updates).filter((key) => allowedFields.includes(key));

      if (updateKeys.length === 0) return this.findById(id);

      let query = 'UPDATE drives SET ';
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
      query += ' RETURNING id, drive_status';

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error updating drive: ${error.message}`);
    }
  }

  static async getAll(limit = 20, offset = 0, filters = {}) {
    try {
      let query = `
        SELECT d.id, d.company_id, c.name as company_name, d.role_name, d.ctc_min, d.ctc_max, 
               d.interview_date, d.drive_status, d.filled_positions, d.total_positions, d.created_at
        FROM drives d
        JOIN companies c ON d.company_id = c.id
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;

      if (filters.company_id) {
        query += ` AND d.company_id = $${paramIndex}`;
        values.push(filters.company_id);
        paramIndex++;
      }

      if (filters.status) {
        query += ` AND d.drive_status = $${paramIndex}`;
        values.push(filters.status);
        paramIndex++;
      }

      query += ` ORDER BY d.interview_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM drives d WHERE 1=1';
      const countValues = [];
      let countParamIndex = 1;

      if (filters.company_id) {
        countQuery += ` AND d.company_id = $${countParamIndex}`;
        countValues.push(filters.company_id);
        countParamIndex++;
      }

      if (filters.status) {
        countQuery += ` AND d.drive_status = $${countParamIndex}`;
        countValues.push(filters.status);
        countParamIndex++;
      }

      const [dataResult, countResult] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, countValues)
      ]);

      return {
        total: parseInt(countResult.rows[0].total),
        data: dataResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching all drives: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM drives WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error deleting drive: ${error.message}`);
    }
  }
}

module.exports = Drive;
