// ============================================================
// FLIGHT CONTROLLER
// ============================================================

const FlightService = require('../services/FlightService');
const AirlineModel = require('../models/Airline');
const AircraftModel = require('../models/Aircraft');
const { asyncHandler } = require('../middleware/errorHandler');

// Search flights
exports.searchFlights = asyncHandler(async (req, res) => {
    const { origin, destination, departure_date, trip_type } = req.body;

    const flights = await FlightService.searchFlights(
        origin,
        destination,
        departure_date,
        trip_type || 'oneway'
    );

    res.status(200).json({
        success: true,
        data: flights,
        count: flights.length
    });
});

// Get flight details
exports.getFlightDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const flight = await FlightService.getFlightDetails(id);

    res.status(200).json({
        success: true,
        data: flight
    });
});

// Get available seats
exports.getAvailableSeats = asyncHandler(async (req, res) => {
    const { flightId } = req.params;
    const { seatClass } = req.query;

    const seats = await FlightService.getAvailableSeats(flightId, seatClass);

    res.status(200).json({
        success: true,
        data: seats,
        count: seats.length
    });
});

// Get all flights (with pagination)
exports.getAllFlights = asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;

    const flights = await FlightService.getAllFlights(parseInt(limit), parseInt(offset));

    res.status(200).json({
        success: true,
        data: flights,
        count: flights.length
    });
});

// Create flight (admin/airline staff)
exports.createFlight = asyncHandler(async (req, res) => {
    const {
        airline_id,
        aircraft_id,
        flight_number,
        origin,
        destination,
        departure_time,
        arrival_time,
        price_economy,
        price_business,
        duration_minutes,
        stops
    } = req.body;

    // Verify airline exists
    const airline = await AirlineModel.findById(airline_id);
    if (!airline) {
        return res.status(404).json({
            success: false,
            message: 'Airline not found'
        });
    }

    // Verify aircraft exists
    const aircraft = await AircraftModel.findById(aircraft_id);
    if (!aircraft) {
        return res.status(404).json({
            success: false,
            message: 'Aircraft not found'
        });
    }

    const flightData = {
        airline_id,
        aircraft_id,
        flight_number,
        origin,
        destination,
        departure_time,
        arrival_time,
        price_economy,
        price_business,
        available_seats: aircraft.total_seats,
        total_seats: aircraft.total_seats,
        duration_minutes,
        stops: stops || 0
    };

    const result = await FlightService.createFlight(flightData);

    res.status(201).json({
        success: true,
        message: 'Flight created successfully',
        data: result
    });
});

// Update flight status (admin/airline staff)
exports.updateFlightStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await FlightService.updateFlightStatus(id, status);

    res.status(200).json({
        success: true,
        message: 'Flight status updated successfully'
    });
});

// Get flights by airline
exports.getFlightsByAirline = asyncHandler(async (req, res) => {
    const { airlineId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const flights = await FlightService.getFlightsByAirline(
        airlineId,
        parseInt(limit),
        parseInt(offset)
    );

    res.status(200).json({
        success: true,
        data: flights,
        count: flights.length
    });
});
