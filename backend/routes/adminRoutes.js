// ============================================================
// ADMIN ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken, authorizeAdmin);

// ============================================================
// AIRLINE MANAGEMENT
// ============================================================
router.get('/airlines', adminController.getAllAirlines);
router.post('/airlines', adminController.createAirline);
router.put('/airlines/:id', adminController.updateAirline);
router.get('/airlines/:id/statistics', adminController.getAirlineStatistics);

// ============================================================
// AIRCRAFT MANAGEMENT
// ============================================================
router.post('/aircraft', adminController.createAircraft);
router.get('/aircraft', adminController.getAllAircraft);

// ============================================================
// ANALYTICS AND STATISTICS
// ============================================================
router.get('/dashboard/statistics', adminController.getDashboardStatistics);
router.get('/users', adminController.getAllUsers);
router.get('/revenue-report', adminController.getRevenueReport);
router.get('/flights', adminController.getFlightManagement);

module.exports = router;
