// ============================================================
// FLIGHT ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { authenticateToken, authorizeAirlineStaff } = require('../middleware/auth');
const { flightValidations } = require('../middleware/validation');

// Public routes
router.post('/search', flightValidations.searchFlights, flightController.searchFlights);
router.get('/:id', flightController.getFlightDetails);
router.get('/:flightId/seats', flightController.getAvailableSeats);
router.get('/', flightController.getAllFlights);

// Airline staff / Admin routes
router.post('/', authenticateToken, authorizeAirlineStaff, flightValidations.createFlight, flightController.createFlight);
router.patch('/:id/status', authenticateToken, authorizeAirlineStaff, flightController.updateFlightStatus);

// Get flights by airline
router.get('/airline/:airlineId', flightController.getFlightsByAirline);

module.exports = router;
