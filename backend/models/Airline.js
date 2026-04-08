// ============================================================
// AIRLINE MODEL - DATABASE LAYER
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

class AirlineModel {
    // Get all airlines
    static async getAll() {
        try {
            const query = `SELECT * FROM airlines WHERE is_active = 1 ORDER BY name ASC`;
            const rows = await runQuery(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Find airline by ID
    static async findById(airlineId) {
        try {
            const query = `SELECT * FROM airlines WHERE id = ? AND is_active = 1`;
            const row = await runQuerySingle(query, [airlineId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Find airline by code
    static async findByCode(airlineCode) {
        try {
            const query = `SELECT * FROM airlines WHERE airline_code = ? AND is_active = 1`;
            const row = await runQuerySingle(query, [airlineCode]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Create airline
    static async create(airlineData) {
        try {
            const query = `INSERT INTO airlines (name, primary_color, secondary_color, logo_url, airline_code, description)
                          VALUES (?, ?, ?, ?, ?, ?)`;
            const result = await runInsert(query, [
                airlineData.name,
                airlineData.primary_color,
                airlineData.secondary_color,
                airlineData.logo_url,
                airlineData.airline_code,
                airlineData.description
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Update airline
    static async update(airlineId, updateData) {
        try {
            const query = `UPDATE airlines SET
                          name = ?, primary_color = ?, secondary_color = ?,
                          logo_url = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                          WHERE id = ?`;
            const result = await runUpdate(query, [
                updateData.name,
                updateData.primary_color,
                updateData.secondary_color,
                updateData.logo_url,
                updateData.description,
                airlineId
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Get airline statistics
    static async getStatistics(airlineId) {
        try {
            const query = `SELECT
                          COUNT(DISTINCT f.id) as total_flights,
                          SUM(CASE WHEN f.status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_flights,
                          COUNT(DISTINCT b.id) as total_bookings,
                          SUM(b.total_amount) as total_revenue
                          FROM airlines a
                          LEFT JOIN flights f ON a.id = f.airline_id
                          LEFT JOIN bookings b ON f.id = b.flight_id AND b.status = 'confirmed'
                          WHERE a.id = ?`;
            const row = await runQuerySingle(query, [airlineId]);
            return row;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AirlineModel;
