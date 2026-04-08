// ============================================================
// DATABASE INITIALIZATION SCRIPT
// Automatically creates tables and inserts sample data
// ============================================================

const { db } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Helper to execute SQL statements sequentially
const executeSqlFile = () => {
    return new Promise((resolve, reject) => {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by statements, but preserve CREATE and INSERT blocks
        const statements = [];
        let currentStatement = '';

        schema.split('\n').forEach(line => {
            const trimmedLine = line.trim();

            // Skip comments and empty lines
            if (trimmedLine.startsWith('--') || trimmedLine === '') {
                return;
            }

            currentStatement += line + ' ';

            // If line ends with semicolon, it's a complete statement
            if (trimmedLine.endsWith(';')) {
                statements.push(currentStatement.trim());
                currentStatement = '';
            }
        });

        // Execute statements sequentially
        const executeNextStatement = (index) => {
            if (index >= statements.length) {
                resolve();
                return;
            }

            const statement = statements[index].slice(0, -1); // Remove trailing semicolon

            if (statement.length === 0) {
                executeNextStatement(index + 1);
                return;
            }

            db.run(statement, (err) => {
                if (err) {
                    // Only warn on specific errors, not INSERT into non-existent tables
                    if (
                        !err.message.includes('already exists') &&
                        !err.message.includes('UNIQUE constraint failed')
                    ) {
                        console.warn(`Note: ${err.message}`);
                    }
                }
                executeNextStatement(index + 1);
            });
        };

        executeNextStatement(0);
    });
};

// Initialize database
async function initializeDatabase() {
    console.log('Initializing SQLite database...');
    try {
        await executeSqlFile();
        console.log('✓ Database initialized successfully');
        return true;
    } catch (error) {
        console.error('✗ Database initialization failed:', error);
        return false;
    }
}

module.exports = { initializeDatabase };
