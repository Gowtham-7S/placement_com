const express = require('express');
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

// Get all companies (public data)
// router.get('/companies', JuniorController.getAllCompanies);

// Get company details and insights
// router.get('/companies/:id/insights', JuniorController.getCompanyInsights);

// ========== INTERVIEW PATTERNS ==========

// Get interview patterns for a company
// router.get('/companies/:id/patterns', JuniorController.getInterviewPatterns);

// ========== PREPARATION ROADMAPS ==========

// Get AI-generated preparation roadmap
// router.get('/roadmap', JuniorController.generateRoadmap);

// ========== STATISTICS & TRENDS ==========

// Get overall placement statistics
// router.get('/statistics', JuniorController.getStatistics);

// Get topic trends
// router.get('/trends/topics', JuniorController.getTopicTrends);

// Get skill requirements
// router.get('/trends/skills', JuniorController.getSkillTrends);

module.exports = router;
