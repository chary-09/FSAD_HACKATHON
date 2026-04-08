// ============================================================
// USER MODEL - DATABASE LAYER
// ============================================================

const { db } = require('../config/database');

// Helper function to run queries with promises
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

class UserModel {
    // Create new user
    static async create(name, email, hashedPassword, phone = null, role = 'user') {
        try {
            const query = `INSERT INTO users (name, email, password, phone, role)
                          VALUES (?, ?, ?, ?, ?)`;
            const result = await runInsert(query, [name, email, hashedPassword, phone, role]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const query = `SELECT * FROM users WHERE email = ?`;
            const row = await runQuerySingle(query, [email]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Find user by ID
    static async findById(userId) {
        try {
            const query = `SELECT id, name, email, phone, role, passport_number, date_of_birth,
                          profile_picture_url, is_active, created_at, updated_at FROM users WHERE id = ?`;
            const row = await runQuerySingle(query, [userId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    static async updateProfile(userId, name, phone, passport_number, date_of_birth) {
        try {
            const query = `UPDATE users SET name = ?, phone = ?, passport_number = ?,
                          date_of_birth = ?, updated_at = CURRENT_TIMESTAMP
                          WHERE id = ?`;
            const result = await runUpdate(query, [name, phone, passport_number, date_of_birth, userId]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Update password
    static async updatePassword(userId, hashedPassword) {
        try {
            const query = `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            const result = await runUpdate(query, [hashedPassword, userId]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Get all users (admin)
    static async getAllUsers(limit = 50, offset = 0) {
        try {
            const query = `SELECT id, name, email, phone, role, is_active, created_at FROM users
                          LIMIT ? OFFSET ?`;
            const rows = await runQuery(query, [limit, offset]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get total user count
    static async getTotalCount() {
        try {
            const query = `SELECT COUNT(*) as total FROM users`;
            const row = await runQuerySingle(query);
            return row.total;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserModel;
