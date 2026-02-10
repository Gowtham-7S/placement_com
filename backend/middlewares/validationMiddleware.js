const { validationResult, body, param, query } = require('express-validator');
const constants = require('../config/constants');

/**
 * Validation Error Handler Middleware
 * Handles validation errors from express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(constants.HTTP_BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

/**
 * Common Validators
 */
const validators = {
  // Email validation
  email: body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  // Password validation
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(constants.PASSWORD_REGEX)
    .withMessage('Password must contain uppercase, number, and special character'),

  // User registration validation
  registerValidation: [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(constants.PASSWORD_REGEX)
      .withMessage('Password must contain uppercase, number, and special character'),
    body('first_name')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters'),
    body('last_name')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters'),
    body('role')
      .isIn(constants.ROLES)
      .withMessage(`Role must be one of: ${constants.ROLES.join(', ')}`),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('department').optional().trim(),
    body('batch_year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Invalid batch year'),
  ],

  // Login validation
  loginValidation: [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],

  // Company validation
  companyValidation: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Company name is required')
      .isLength({ min: 2 })
      .withMessage('Company name must be at least 2 characters'),
    body('description').optional().trim(),
    body('logo_url').optional().isURL().withMessage('Invalid URL format'),
    body('website').optional().isURL().withMessage('Invalid URL format'),
    body('industry').optional().trim(),
    body('company_size').optional().trim(),
    body('founded_year').optional().isInt({ min: 1800, max: 2100 }).withMessage('Invalid year'),
  ],

  // Drive validation
  driveValidation: [
    body('company_id').isInt().withMessage('Company ID must be an integer'),
    body('role_name')
      .trim()
      .notEmpty()
      .withMessage('Role name is required')
      .isLength({ min: 2 })
      .withMessage('Role name must be at least 2 characters'),
    body('ctc_min').optional().isFloat({ min: 0 }).withMessage('CTC min must be positive'),
    body('ctc_max').optional().isFloat({ min: 0 }).withMessage('CTC max must be positive'),
    body('interview_date').isISO8601().withMessage('Invalid interview date format'),
    body('mode')
      .isIn(constants.INTERVIEW_MODES)
      .withMessage(`Mode must be one of: ${constants.INTERVIEW_MODES.join(', ')}`),
  ],

  // Experience validation
  experienceValidation: [
    body('drive_id').isInt().withMessage('Drive ID must be an integer'),
    body('company_name')
      .trim()
      .notEmpty()
      .withMessage('Company name is required'),
    body('role_applied')
      .trim()
      .notEmpty()
      .withMessage('Role applied is required'),
    body('result')
      .isIn(constants.INTERVIEW_RESULTS)
      .withMessage(`Result must be one of: ${constants.INTERVIEW_RESULTS.join(', ')}`),
    body('selected').optional().isBoolean().withMessage('Selected must be boolean'),
    body('offer_received').optional().isBoolean().withMessage('Offer received must be boolean'),
  ],

  // ID parameter validation
  idParam: param('id').isInt().withMessage('ID must be an integer'),

  // Pagination validation
  paginationQuery: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: constants.MAX_LIMIT })
      .withMessage(`Limit must be between 1 and ${constants.MAX_LIMIT}`),
  ],

  // Update Profile validation
  updateProfileValidation: [
    body('first_name').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('last_name').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('department').optional().trim(),
    body('bio').optional().trim(),
    body('profile_picture_url').optional().isURL().withMessage('Invalid URL format'),
  ],
};

module.exports = {
  handleValidationErrors,
  validators,
  validationResult,
  body,
  param,
  query,
};
