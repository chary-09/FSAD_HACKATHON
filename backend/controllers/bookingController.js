// ============================================================
// BOOKING CONTROLLER
// ============================================================

const BookingService = require('../services/BookingService');
const AirlineModel = require('../models/Airline');
const FlightModel = require('../models/Flight');
const { asyncHandler } = require('../middleware/errorHandler');

// Create booking
exports.createBooking = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { flight_id, seat_id, passenger_name, passenger_email, passenger_phone, passenger_passport, special_requests } = req.body;

    const result = await BookingService.createBooking(userId, flight_id, seat_id, {
        passenger_name,
        passenger_email,
        passenger_phone,
        passenger_passport,
        special_requests
    });

    res.status(201).json({
        success: true,
        message: 'Booking created successfully. Please proceed to payment.',
        data: result
    });
});

// Get user bookings
exports.getUserBookings = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const bookings = await BookingService.getUserBookings(userId, parseInt(limit), parseInt(offset));

    res.status(200).json({
        success: true,
        data: bookings,
        count: bookings.length
    });
});

// Get booking details
exports.getBookingDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await BookingService.getBookingDetails(id);

    res.status(200).json({
        success: true,
        data: booking
    });
});

// Generate boarding pass
exports.generateBoardingPass = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get booking to retrieve flight info
    const booking = await BookingService.getBookingDetails(id);
    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    // Get airline details for branding
    const flight = await FlightModel.findById(booking.flight_id);
    const airline = await AirlineModel.findById(flight.airline_id);

    const boardingPass = await BookingService.generateBoardingPass(id, airline);

    res.status(200).json({
        success: true,
        message: 'Boarding pass generated successfully',
        data: {
            qrCode: boardingPass.qrCode,
            pdfUrl: boardingPass.pdfUrl,
            fileName: boardingPass.fileName
        }
    });
});

// Cancel booking
exports.cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await BookingService.cancelBooking(id);

    res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: result
    });
});

// Get booking statistics (admin)
exports.getBookingStatistics = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;

    const stats = await BookingService.getStatistics(start_date, end_date);

    res.status(200).json({
        success: true,
        data: stats
    });
});
