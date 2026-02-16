const express = require('express');
const CompanyController = require('../controllers/CompanyController');
const DriveController = require('../controllers/DriveController');
const ExperienceController = require('../controllers/ExperienceController');
const { validators, handleValidationErrors } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * Admin Routes (Protected)
 * All routes require authentication and admin role
 */

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// ========== COMPANY MANAGEMENT ==========

// Get all companies
router.get('/companies', CompanyController.getAllCompanies);

// Get company by ID
router.get('/companies/:id', validators.idParam, handleValidationErrors, CompanyController.getCompany);

// Create company
router.post(
  '/companies',
  validators.companyValidation,
  handleValidationErrors,
  CompanyController.createCompany
);

// Update company
router.put(
  '/companies/:id',
  validators.idParam,
  handleValidationErrors,
  CompanyController.updateCompany
);

// Delete company
router.delete('/companies/:id', validators.idParam, handleValidationErrors, CompanyController.deleteCompany);

// ========== DRIVE MANAGEMENT ==========

// Get all drives
router.get('/drives', DriveController.getAllDrives);

// Get drive by ID
router.get('/drives/:id', validators.idParam, handleValidationErrors, DriveController.getDrive);

// Create drive
router.post(
  '/drives',
  validators.driveValidation,
  handleValidationErrors,
  DriveController.createDrive
);

// Update drive
router.put(
  '/drives/:id',
  validators.driveValidation,
  handleValidationErrors,
  DriveController.updateDrive
);

// Delete drive
router.delete('/drives/:id', validators.idParam, handleValidationErrors, DriveController.deleteDrive);

// ========== EXPERIENCE/SUBMISSION MANAGEMENT ==========

// Get pending submissions
router.get('/submissions/pending', ExperienceController.getPendingSubmissions);

// Approve submission
router.post(
  '/submissions/:id/approve',
  validators.idParam,
  handleValidationErrors,
  ExperienceController.approveSubmission
);

// Reject submission
router.post(
  '/submissions/:id/reject',
  validators.idParam,
  handleValidationErrors,
  ExperienceController.rejectSubmission
);

// ========== ANALYTICS ==========
const AnalyticsController = require('../controllers/AnalyticsController');

// Get dashboard analytics
router.get('/analytics/dashboard', AnalyticsController.getDashboardStats);

module.exports = router;
