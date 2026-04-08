// ============================================================
// AIRCRAFT MODEL - DATABASE LAYER
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

class AircraftModel {
    // Create aircraft
    static async create(aircraftData) {
        try {
            const query = `INSERT INTO aircraft
                (airline_id, aircraft_name, aircraft_model, total_seats,
                economy_seats, business_seats, manufacturing_year)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const result = await runInsert(query, [
                aircraftData.airline_id,
                aircraftData.aircraft_name,
                aircraftData.aircraft_model,
                aircraftData.total_seats,
                aircraftData.economy_seats,
                aircraftData.business_seats,
                aircraftData.manufacturing_year
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Find aircraft by ID
    static async findById(aircraftId) {
        try {
            const query = `SELECT * FROM aircraft WHERE id = ? AND is_active = 1`;
            const row = await runQuerySingle(query, [aircraftId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Get aircraft by airline
    static async getByAirline(airlineId) {
        try {
            const query = `SELECT * FROM aircraft WHERE airline_id = ? AND is_active = 1 ORDER BY aircraft_name ASC`;
            const rows = await runQuery(query, [airlineId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get all aircraft
    static async getAll(limit = 50, offset = 0) {
        try {
            const query = `SELECT a.*, al.name as airline_name FROM aircraft a
                          LEFT JOIN airlines al ON a.airline_id = al.id
                          WHERE a.is_active = 1
                          ORDER BY a.aircraft_name ASC
                          LIMIT ? OFFSET ?`;
            const rows = await runQuery(query, [limit, offset]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Update aircraft
    static async update(aircraftId, updateData) {
        try {
            const query = `UPDATE aircraft SET
                          aircraft_name = ?, aircraft_model = ?, total_seats = ?,
                          economy_seats = ?, business_seats = ?, updated_at = CURRENT_TIMESTAMP
                          WHERE id = ?`;
            const result = await runUpdate(query, [
                updateData.aircraft_name,
                updateData.aircraft_model,
                updateData.total_seats,
                updateData.economy_seats,
                updateData.business_seats,
                aircraftId
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AircraftModel;
