const { pool } = require('../config/database');
const AnalyticsService = require('../services/AnalyticsService');

async function testAnalytics() {
    try {
        console.log("Testing Analytics Service...");

        console.log("\n--- Overall Stats ---");
        const overall = await AnalyticsService.getOverallStats();
        console.log(overall);

        console.log("\n--- Company Stats ---");
        const companyStats = await AnalyticsService.getCompanyStats();
        console.table(companyStats);

        console.log("\n--- Recent Activity ---");
        const recent = await AnalyticsService.getRecentActivity();
        console.table(recent);

    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await pool.end();
    }
}

testAnalytics();
