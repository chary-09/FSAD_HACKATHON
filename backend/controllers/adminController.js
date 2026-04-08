// ============================================================
// ADMIN CONTROLLER
// ============================================================

const AirlineModel = require('../models/Airline');
const AircraftModel = require('../models/Aircraft');
const FlightModel = require('../models/Flight');
const UserModel = require('../models/User');
const BookingService = require('../services/BookingService');
const PaymentService = require('../services/PaymentService');
const { asyncHandler } = require('../middleware/errorHandler');

// ============================================================
// AIRLINE MANAGEMENT
// ============================================================

// Get all airlines
exports.getAllAirlines = asyncHandler(async (req, res) => {
    const airlines = await AirlineModel.getAll();

    res.status(200).json({
        success: true,
        data: airlines,
        count: airlines.length
    });
});

// Create airline
exports.createAirline = asyncHandler(async (req, res) => {
    const { name, primary_color, secondary_color, logo_url, airline_code, description } = req.body;

    const result = await AirlineModel.create({
        name,
        primary_color,
        secondary_color,
        logo_url,
        airline_code,
        description
    });

    res.status(201).json({
        success: true,
        message: 'Airline created successfully',
        data: { airlineId: result.insertId }
    });
});

// Update airline
exports.updateAirline = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, primary_color, secondary_color, logo_url, description } = req.body;

    await AirlineModel.update(id, {
        name,
        primary_color,
        secondary_color,
        logo_url,
        description
    });

    res.status(200).json({
        success: true,
        message: 'Airline updated successfully'
    });
});

// Get airline statistics
exports.getAirlineStatistics = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const stats = await AirlineModel.getStatistics(id);

    res.status(200).json({
        success: true,
        data: stats
    });
});

// ============================================================
// AIRCRAFT MANAGEMENT
// ============================================================

// Create aircraft
exports.createAircraft = asyncHandler(async (req, res) => {
    const { airline_id, aircraft_name, aircraft_model, total_seats, economy_seats, business_seats, manufacturing_year } = req.body;

    // Verify total seats calculation
    if (economy_seats + business_seats !== total_seats) {
        return res.status(400).json({
            success: false,
            message: 'Sum of economy and business seats must equal total seats'
        });
    }

    const result = await AircraftModel.create({
        airline_id,
        aircraft_name,
        aircraft_model,
        total_seats,
        economy_seats,
        business_seats,
        manufacturing_year
    });

    res.status(201).json({
        success: true,
        message: 'Aircraft created successfully',
        data: { aircraftId: result.insertId }
    });
});

// Get all aircraft
exports.getAllAircraft = asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;

    const aircraft = await AircraftModel.getAll(parseInt(limit), parseInt(offset));

    res.status(200).json({
        success: true,
        data: aircraft,
        count: aircraft.length
    });
});

// ============================================================
// ANALYTICS AND STATISTICS
// ============================================================

// Get dashboard statistics
exports.getDashboardStatistics = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;

    const bookingStats = await BookingService.getStatistics(start_date, end_date);
    const paymentStats = await PaymentService.getStatistics(start_date, end_date);
    const totalUsers = await UserModel.getTotalCount();

    res.status(200).json({
        success: true,
        data: {
            bookings: bookingStats,
            payments: paymentStats,
            totalUsers: totalUsers
        }
    });
});

// Get user management (view all users)
exports.getAllUsers = asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;

    const users = await UserModel.getAllUsers(parseInt(limit), parseInt(offset));
    const totalUsers = await UserModel.getTotalCount();

    res.status(200).json({
        success: true,
        data: users,
        count: users.length,
        total: totalUsers
    });
});

// Get revenue report
exports.getRevenueReport = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;

    const paymentStats = await PaymentService.getStatistics(start_date, end_date);

    res.status(200).json({
        success: true,
        data: {
            totalRevenue: paymentStats.total_amount,
            successfulPayments: paymentStats.successful,
            failedPayments: paymentStats.failed,
            averageTransactionValue: paymentStats.total_amount / paymentStats.total_payments
        }
    });
});

// Get flight management
exports.getFlightManagement = asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;

    const flights = await FlightModel.getAll(parseInt(limit), parseInt(offset));

    res.status(200).json({
        success: true,
        data: flights,
        count: flights.length
    });
});
