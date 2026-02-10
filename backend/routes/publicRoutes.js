const express = require('express');

const router = express.Router();

/**
 * Public Routes (No Authentication Required)
 */

// ========== PUBLIC ENDPOINTS ==========

// Get public company information
// router.get('/companies', PublicController.getPublicCompanies);

// Get public statistics
// router.get('/statistics', PublicController.getPublicStatistics);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running now',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
