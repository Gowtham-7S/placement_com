const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'default_secret_key', {
    expiresIn: '1d',
  });
};

// @desc    Register a new user (Student/Junior)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { first_name, last_name, email, password, role, phone, department, batch_year } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert user
    // Default role is 'junior' if not specified, but we allow 'student'
    const validRole = ['student', 'junior', 'admin'].includes(role) ? role : 'junior';

    const newUser = await pool.query(
      `INSERT INTO users (
        first_name, last_name, email, password_hash, role, phone, department, batch_year
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, first_name, last_name, email, role, created_at`,
      [first_name, last_name, email, password_hash, validRole, phone, department, batch_year]
    );

    const user = newUser.rows[0];

    // 4. Generate Token
    const token = generateToken(user.id, user.role);

    logger.info(`New user registered: ${email} (${user.role})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 1. Check for user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate Token
    const token = generateToken(user.id, user.role);

    // 4. Update last login (optional, if we had a last_login field)
    // await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await pool.query('SELECT id, first_name, last_name, email, role FROM users WHERE id = $1', [req.user.id]);
    
    res.status(200).json({
      success: true,
      data: user.rows[0]
    });
  } catch (err) {
    next(err);
  }
};