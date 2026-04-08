// ============================================================
// FLIGHT SERVICE - BUSINESS LOGIC
// ============================================================

const FlightModel = require('../models/Flight');
const SeatModel = require('../models/Seat');
const AircraftModel = require('../models/Aircraft');

class FlightService {
    // Create flight and generate seats
    static async createFlight(flightData) {
        try {
            // Verify aircraft exists
            const aircraft = await AircraftModel.findById(flightData.aircraft_id);
            if (!aircraft) {
                throw new Error('Aircraft not found');
            }

            // Create flight
            const flightResult = await FlightModel.create(flightData);
            const flightId = flightResult.insertId;

            // Create seats for this flight
            await SeatModel.createSeatsForFlight(
                flightId,
                aircraft.total_seats,
                aircraft.economy_seats,
                aircraft.business_seats
            );

            return {
                flightId,
                ...flightData
            };
        } catch (error) {
            throw error;
        }
    }

    // Search flights
    static async searchFlights(origin, destination, departureDate, tripType = 'oneway') {
        try {
            const flights = await FlightModel.searchByRoute(origin, destination, departureDate);
            
            // Enhance with seat statistics
            const enrichedFlights = await Promise.all(
                flights.map(async (flight) => {
                    const seatStats = await SeatModel.getSeatStatistics(flight.id);
                    return {
                        ...flight,
                        seatStatistics: seatStats
                    };
                })
            );

            return enrichedFlights;
        } catch (error) {
            throw error;
        }
    }

    // Get flight details
    static async getFlightDetails(flightId) {
        try {
            const flight = await FlightModel.findById(flightId);
            if (!flight) {
                throw new Error('Flight not found');
            }

            // Get seat statistics
            const seatStats = await SeatModel.getSeatStatistics(flightId);

            return {
                ...flight,
                seatStatistics: seatStats
            };
        } catch (error) {
            throw error;
        }
    }

    // Get available seats for flight
    static async getAvailableSeats(flightId, seatClass = null) {
        try {
            const seats = await SeatModel.getAvailableSeats(flightId, seatClass);
            return seats;
        } catch (error) {
            throw error;
        }
    }

    // Update flight status
    static async updateFlightStatus(flightId, status) {
        try {
            const validStatuses = ['scheduled', 'delayed', 'boarding', 'departed', 'landed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid flight status');
            }

            const result = await FlightModel.updateStatus(flightId, status);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Get all flights
    static async getAllFlights(limit = 50, offset = 0) {
        try {
            const flights = await FlightModel.getAll(limit, offset);
            return flights;
        } catch (error) {
            throw error;
        }
    }

    // Get flights by airline
    static async getFlightsByAirline(airlineId, limit = 50, offset = 0) {
        try {
            const flights = await FlightModel.getByAirline(airlineId, limit, offset);
            return flights;
        } catch (error) {
            throw error;
        }
    }

    // Cleanup expired seat reservations
    static async cleanupExpiredReservations() {
        try {
            const expiredSeats = await SeatModel.getExpiredReservations();
            
            let releaseCount = 0;
            for (const seat of expiredSeats) {
                await SeatModel.releaseReservedSeat(seat.id);
                releaseCount++;
            }

            console.log(`✓ Released ${releaseCount} expired seat reservations`);
            return releaseCount;
        } catch (error) {
            console.error('✗ Error cleaning up expired reservations:', error.message);
            throw error;
        }
    }
}

module.exports = FlightService;
