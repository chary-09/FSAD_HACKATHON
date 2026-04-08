// ============================================================
// SEAT MODEL - DATABASE LAYER
// ============================================================

const { db } = require('../config/database');

// Helper functions
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const runQuerySingle = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const runInsert = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ insertId: this.lastID, changes: this.changes });
        });
    });
};

const runUpdate = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

class SeatModel {
    // Get all seats for a flight
    static async getSeatsByFlight(flightId) {
        try {
            const query = `SELECT * FROM seats WHERE flight_id = ? ORDER BY seat_number ASC`;
            const rows = await runQuery(query, [flightId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get seat by ID
    static async findById(seatId) {
        try {
            const query = `SELECT * FROM seats WHERE id = ?`;
            const row = await runQuerySingle(query, [seatId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Get available seats for a flight
    static async getAvailableSeats(flightId, seatClass = null) {
        try {
            let query = `SELECT * FROM seats WHERE flight_id = ? AND status = 'available'`;
            const params = [flightId];

            if (seatClass) {
                query += ` AND seat_class = ?`;
                params.push(seatClass);
            }

            query += ` ORDER BY seat_number ASC`;
            const rows = await runQuery(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Reserve seat (temporary hold)
    static async reserveSeat(seatId, reservedUntil) {
        try {
            const query = `UPDATE seats SET status = 'reserved', reserved_until = ?
                          WHERE id = ? AND status = 'available'`;
            const result = await runUpdate(query, [reservedUntil, seatId]);
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }

    // Book seat (permanent)
    static async bookSeat(seatId) {
        try {
            const query = `UPDATE seats SET status = 'booked', reserved_until = NULL
                          WHERE id = ? AND (status = 'available' OR status = 'reserved')`;
            const result = await runUpdate(query, [seatId]);
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }

    // Release reserved seat
    static async releaseReservedSeat(seatId) {
        try {
            const query = `UPDATE seats SET status = 'available', reserved_until = NULL
                          WHERE id = ? AND status = 'reserved'`;
            const result = await runUpdate(query, [seatId]);
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get expired reservations
    static async getExpiredReservations() {
        try {
            const query = `SELECT * FROM seats WHERE status = 'reserved'
                          AND reserved_until < datetime('now')`;
            const rows = await runQuery(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Create seats for a flight
    static async createSeatsForFlight(flightId, totalSeats, economySeats, businessSeats) {
        try {
            const allSeats = [];

            // Create economy seats
            for (let i = 1; i <= economySeats; i++) {
                allSeats.push([flightId, `E${i}`, 'economy', 'available']);
            }

            // Create business seats
            for (let i = 1; i <= businessSeats; i++) {
                allSeats.push([flightId, `B${i}`, 'business', 'available']);
            }

            // Insert all seats
            for (const seat of allSeats) {
                const query = `INSERT INTO seats (flight_id, seat_number, seat_class, status) VALUES (?, ?, ?, ?)`;
                await runInsert(query, seat);
            }

            return { changes: allSeats.length };
        } catch (error) {
            throw error;
        }
    }

    // Get seat statistics for a flight
    static async getSeatStatistics(flightId) {
        try {
            const query = `SELECT
                          seat_class,
                          COUNT(*) as total,
                          SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
                          SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) as booked,
                          SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved
                          FROM seats
                          WHERE flight_id = ?
                          GROUP BY seat_class`;
            const rows = await runQuery(query, [flightId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SeatModel;
