// ============================================================
// BOOKING SERVICE - BUSINESS LOGIC
// ============================================================

const BookingModel = require('../models/Booking');
const SeatModel = require('../models/Seat');
const FlightModel = require('../models/Flight');
const PaymentModel = require('../models/Payment');
const { sendBookingConfirmation } = require('../utils/emailService');
const { generateBoardingPass } = require('../utils/boardingPassGenerator');

class BookingService {
    // Create booking
    static async createBooking(userId, flightId, seatId, passengerData) {
        try {
            // Verify flight exists
            const flight = await FlightModel.findById(flightId);
            if (!flight) {
                throw new Error('Flight not found');
            }

            // Verify seat exists and is available
            const seat = await SeatModel.findById(seatId);
            if (!seat) {
                throw new Error('Seat not found');
            }

            if (seat.status !== 'available' && seat.status !== 'reserved') {
                throw new Error('Seat is not available');
            }

            // Reserve seat temporarily
            const reservationExpiry = new Date();
            reservationExpiry.setSeconds(reservationExpiry.getSeconds() + (parseInt(process.env.SEAT_RESERVATION_TIMEOUT) || 300));
            
            const isReserved = await SeatModel.reserveSeat(seatId, reservationExpiry);
            if (!isReserved) {
                throw new Error('Failed to reserve seat');
            }

            // Determine price based on seat class
            const price = seat.seat_class === 'business' ? flight.price_business : flight.price_economy;

            // Create booking
            const bookingData = {
                user_id: userId,
                flight_id: flightId,
                seat_id: seatId,
                total_amount: price,
                passenger_name: passengerData.passenger_name,
                passenger_email: passengerData.passenger_email,
                passenger_phone: passengerData.passenger_phone,
                passenger_passport: passengerData.passenger_passport,
                special_requests: passengerData.special_requests
            };

            const bookingResult = await BookingModel.create(bookingData);
            const bookingId = bookingResult.insertId;

            return {
                bookingId,
                bookingReference: bookingResult.bookingReference,
                status: 'pending',
                amount: price,
                flightNumber: flight.flight_number
            };
        } catch (error) {
            throw error;
        }
    }

    // Confirm booking (after payment)
    static async confirmBooking(bookingId) {
        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            // Book the seat permanently
            const seatBooked = await SeatModel.bookSeat(booking.seat_id);
            if (!seatBooked) {
                throw new Error('Failed to book seat');
            }

            // Update booking status
            await BookingModel.updateStatus(bookingId, 'confirmed');

            // Send confirmation email
            try {
                await sendBookingConfirmation(booking.passenger_email, {
                    booking_reference: booking.booking_reference,
                    passenger_name: booking.passenger_name,
                    flight_number: booking.flight_number,
                    origin: booking.origin,
                    destination: booking.destination,
                    departure_time: booking.departure_time,
                    seat_number: booking.seat_number,
                    total_amount: booking.total_amount
                });
            } catch (emailError) {
                console.warn('⚠ Email sending failed:', emailError.message);
            }

            return {
                success: true,
                bookingId,
                bookingReference: booking.booking_reference,
                status: 'confirmed'
            };
        } catch (error) {
            throw error;
        }
    }

    // Generate boarding pass
    static async generateBoardingPass(bookingId, airlineData) {
        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== 'confirmed') {
                throw new Error('Booking must be confirmed to generate boarding pass');
            }

            const boardingPassData = {
                booking_reference: booking.booking_reference,
                passenger_name: booking.passenger_name,
                flight_number: booking.flight_number,
                seat_number: booking.seat_number,
                seat_class: booking.seat_class,
                origin: booking.origin,
                destination: booking.destination,
                departure_time: booking.departure_time,
                passenger_email: booking.passenger_email
            };

            const boardingPass = await generateBoardingPass(boardingPassData, airlineData);

            // Update booking with boarding pass URL
            await BookingModel.updateBoardingPass(bookingId, boardingPass.pdfUrl);

            return boardingPass;
        } catch (error) {
            throw error;
        }
    }

    // Get user bookings
    static async getUserBookings(userId, limit = 50, offset = 0) {
        try {
            const bookings = await BookingModel.getByUserId(userId, limit, offset);
            return bookings;
        } catch (error) {
            throw error;
        }
    }

    // Get booking details
    static async getBookingDetails(bookingId) {
        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            // Get payment details
            const payment = await PaymentModel.findByBookingId(bookingId);

            return {
                ...booking,
                payment: payment || null
            };
        } catch (error) {
            throw error;
        }
    }

    // Cancel booking
    static async cancelBooking(bookingId) {
        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status === 'cancelled') {
                throw new Error('Booking is already cancelled');
            }

            // Release the seat
            await SeatModel.releaseReservedSeat(booking.seat_id);

            // Update booking status
            await BookingModel.cancelBooking(bookingId);

            return {
                success: true,
                bookingId,
                bookingReference: booking.booking_reference,
                status: 'cancelled'
            };
        } catch (error) {
            throw error;
        }
    }

    // Get booking statistics
    static async getStatistics(startDate = null, endDate = null) {
        try {
            const stats = await BookingModel.getStatistics(startDate, endDate);
            return stats;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BookingService;
