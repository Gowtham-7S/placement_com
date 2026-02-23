const express = require('express');
const JuniorController = require('../controllers/JuniorController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * Junior Routes (Protected)
 * Routes for junior students (data consumers)
 */

router.use(authMiddleware);
router.use(roleMiddleware('junior'));

// ========== COMPANY INSIGHTS ==========

// Get all companies with aggregated experience data
router.get('/companies', JuniorController.getCompanyInsights);

// Get approved experiences for a specific company
router.get('/companies/:name/experiences', JuniorController.getCompanyExperiences);

// ========== STATISTICS & TRENDS ==========

// Get overall public placement statistics
router.get('/stats', JuniorController.getPublicStats);

// Get trending interview topics
router.get('/topics', JuniorController.getTrendingTopics);

module.exports = router;
