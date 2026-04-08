// ============================================================
// BOOKING ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { bookingValidations } = require('../middleware/validation');

// Protected routes (user must be authenticated)
router.post('/', authenticateToken, bookingValidations.createBooking, bookingController.createBooking);
router.get('/user/my-bookings', authenticateToken, bookingController.getUserBookings);
router.get('/:id', authenticateToken, bookingController.getBookingDetails);
router.post('/:id/boarding-pass', authenticateToken, bookingController.generateBoardingPass);
router.delete('/:id', authenticateToken, bookingController.cancelBooking);

// Admin routes
router.get('/admin/statistics', authenticateToken, authorizeAdmin, bookingController.getBookingStatistics);

module.exports = router;
