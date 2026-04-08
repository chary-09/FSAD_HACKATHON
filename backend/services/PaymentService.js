// ============================================================
// PAYMENT SERVICE - BUSINESS LOGIC
// ============================================================

const PaymentModel = require('../models/Payment');
const BookingModel = require('../models/Booking');
const { sendPaymentConfirmation } = require('../utils/emailService');

class PaymentService {
    // Initialize payment
    static async initiatePayment(bookingId, paymentMethod) {
        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== 'pending') {
                throw new Error('Booking is not in pending status');
            }

            // Create payment record
            const paymentData = {
                booking_id: bookingId,
                amount: booking.total_amount,
                payment_method: paymentMethod
            };

            const paymentResult = await PaymentModel.create(paymentData);

            return {
                paymentId: paymentResult.insertId,
                amount: booking.total_amount,
                bookingReference: booking.booking_reference
            };
        } catch (error) {
            throw error;
        }
    }

    // Process payment success (after verification from payment gateway)
    static async processPaymentSuccess(bookingId, transactionId, paymentGatewayData = null) {
        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            // Get payment record
            const payment = await PaymentModel.findByBookingId(bookingId);
            if (!payment) {
                throw new Error('Payment record not found');
            }

            // Update payment with transaction details
            if (paymentGatewayData) {
                await PaymentModel.updateRazorpayDetails(payment.id, paymentGatewayData);
            } else {
                await PaymentModel.updateStatus(payment.id, 'success', transactionId);
            }

            // Update booking status to confirmed
            await BookingModel.updateStatus(bookingId, 'confirmed');

            // Send payment confirmation email
            try {
                await sendPaymentConfirmation(booking.passenger_email, {
                    passenger_name: booking.passenger_name,
                    transaction_id: transactionId || paymentGatewayData?.payment_id,
                    amount: booking.total_amount,
                    payment_method: payment.payment_method,
                    payment_status: 'success',
                    booking_reference: booking.booking_reference
                });
            } catch (emailError) {
                console.warn('⚠ Email sending failed:', emailError.message);
            }

            return {
                success: true,
                bookingId,
                bookingReference: booking.booking_reference,
                transactionId
            };
        } catch (error) {
            throw error;
        }
    }

    // Handle payment failure
    static async processPaymentFailure(bookingId, errorMessage) {
        try {
            const payment = await PaymentModel.findByBookingId(bookingId);
            if (!payment) {
                throw new Error('Payment record not found');
            }

            // Update payment error
            await PaymentModel.updatePaymentError(payment.id, errorMessage);

            // Keep booking in pending status

            return {
                success: false,
                bookingId,
                error: errorMessage
            };
        } catch (error) {
            throw error;
        }
    }

    // Get payment details
    static async getPaymentDetails(paymentId) {
        try {
            const payment = await PaymentModel.findById(paymentId);
            if (!payment) {
                throw new Error('Payment not found');
            }

            return payment;
        } catch (error) {
            throw error;
        }
    }

    // Refund payment
    static async refundPayment(paymentId, refundAmount) {
        try {
            const payment = await PaymentModel.findById(paymentId);
            if (!payment) {
                throw new Error('Payment not found');
            }

            if (payment.payment_status !== 'success') {
                throw new Error('Only successful payments can be refunded');
            }

            // Process refund
            await PaymentModel.processRefund(paymentId, refundAmount);

            // Cancel booking
            const booking = await BookingModel.findById(payment.booking_id);
            if (booking) {
                await BookingModel.updateStatus(payment.booking_id, 'cancelled');
            }

            return {
                success: true,
                paymentId,
                refundAmount,
                bookingId: payment.booking_id
            };
        } catch (error) {
            throw error;
        }
    }

    // Get payment statistics
    static async getStatistics(startDate = null, endDate = null) {
        try {
            const stats = await PaymentModel.getStatistics(startDate, endDate);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Get payments by status
    static async getPaymentsByStatus(status, limit = 50, offset = 0) {
        try {
            const payments = await PaymentModel.getByStatus(status, limit, offset);
            return payments;
        } catch (error) {
            throw error;
        }
    }

    // Verify Razorpay payment
    static async verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        try {
            // In production, verify signature using crypto-js or similar
            // For now, return success for valid parameters
            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                throw new Error('Invalid Razorpay payment details');
            }

            return {
                verified: true,
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PaymentService;
