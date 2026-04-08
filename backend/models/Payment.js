// ============================================================
// PAYMENT MODEL - DATABASE LAYER
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

class PaymentModel {
    // Create payment record
    static async create(paymentData) {
        try {
            const query = `INSERT INTO payments
                (booking_id, amount, payment_method, payment_status)
                VALUES (?, ?, ?, 'pending')`;
            const result = await runInsert(query, [
                paymentData.booking_id,
                paymentData.amount,
                paymentData.payment_method
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Find payment by ID
    static async findById(paymentId) {
        try {
            const query = `SELECT p.*, b.booking_reference FROM payments p
                          LEFT JOIN bookings b ON p.booking_id = b.id
                          WHERE p.id = ?`;
            const row = await runQuerySingle(query, [paymentId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Find payment by transaction ID
    static async findByTransactionId(transactionId) {
        try {
            const query = `SELECT * FROM payments WHERE transaction_id = ?`;
            const row = await runQuerySingle(query, [transactionId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Find payment by booking ID
    static async findByBookingId(bookingId) {
        try {
            const query = `SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1`;
            const row = await runQuerySingle(query, [bookingId]);
            return row || null;
        } catch (error) {
            throw error;
        }
    }

    // Update payment status
    static async updateStatus(paymentId, paymentStatus, transactionId = null) {
        try {
            let query = `UPDATE payments SET payment_status = ?, processed_at = CURRENT_TIMESTAMP`;
            const params = [paymentStatus];

            if (transactionId) {
                query += `, transaction_id = ?`;
                params.push(transactionId);
            }

            query += ` WHERE id = ?`;
            params.push(paymentId);

            const result = await runUpdate(query, params);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Update razorpay details
    static async updateRazorpayDetails(paymentId, razorpayData) {
        try {
            const query = `UPDATE payments SET
                          razorpay_order_id = ?, razorpay_payment_id = ?,
                          razorpay_signature = ?, payment_status = 'success',
                          transaction_id = ?, processed_at = CURRENT_TIMESTAMP
                          WHERE id = ?`;
            const result = await runUpdate(query, [
                razorpayData.order_id,
                razorpayData.payment_id,
                razorpayData.signature,
                razorpayData.payment_id,
                paymentId
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Update payment error
    static async updatePaymentError(paymentId, errorMessage) {
        try {
            const query = `UPDATE payments SET
                          payment_status = 'failed', error_message = ?,
                          attempt_count = attempt_count + 1
                          WHERE id = ?`;
            const result = await runUpdate(query, [errorMessage, paymentId]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Get payment statistics
    static async getStatistics(startDate = null, endDate = null) {
        try {
            let query = `SELECT
                        COUNT(*) as total_payments,
                        SUM(CASE WHEN payment_status = 'success' THEN 1 ELSE 0 END) as successful,
                        SUM(CASE WHEN payment_status = 'failed' THEN 1 ELSE 0 END) as failed,
                        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending,
                        SUM(amount) as total_amount
                        FROM payments
                        WHERE 1=1`;
            const params = [];

            if (startDate) {
                query += ` AND created_at >= ?`;
                params.push(startDate);
            }

            if (endDate) {
                query += ` AND created_at <= ?`;
                params.push(endDate);
            }

            const row = await runQuerySingle(query, params);
            return row;
        } catch (error) {
            throw error;
        }
    }

    // Get payments by status
    static async getByStatus(paymentStatus, limit = 50, offset = 0) {
        try {
            const query = `SELECT p.*, b.booking_reference FROM payments p
                          LEFT JOIN bookings b ON p.booking_id = b.id
                          WHERE p.payment_status = ?
                          ORDER BY p.created_at DESC
                          LIMIT ? OFFSET ?`;
            const rows = await runQuery(query, [paymentStatus, limit, offset]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Process refund
    static async processRefund(paymentId, refundAmount) {
        try {
            const query = `UPDATE payments SET payment_status = 'refunded', amount = ? WHERE id = ?`;
            const result = await runUpdate(query, [refundAmount, paymentId]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PaymentModel;
