// ============================================================
// DATABASE CONFIGURATION (SQLite)
// ============================================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Create database file path
const dbPath = path.join(__dirname, '..', 'database', 'airline_booking.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('✗ Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('✓ Database connected successfully');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Test database connection
async function testConnection() {
    return new Promise((resolve, reject) => {
        db.get('SELECT 1', (err) => {
            if (err) {
                console.error('✗ Database connection failed:', err.message);
                reject(err);
            } else {
                console.log('✓ Database connected successfully');
                resolve();
            }
        });
    });
}

module.exports = {
    db,
    testConnection
};
