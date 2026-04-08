// ============================================================
// PAYMENT CONTROLLER
// ============================================================

const PaymentService = require('../services/PaymentService');
const BookingService = require('../services/BookingService');
const { asyncHandler } = require('../middleware/errorHandler');

// Initiate payment
exports.initiatePayment = asyncHandler(async (req, res) => {
    const { booking_id, payment_method } = req.body;

    const paymentData = await PaymentService.initiatePayment(booking_id, payment_method);

    res.status(201).json({
        success: true,
        message: 'Payment initiated successfully',
        data: paymentData
    });
});

// Process payment success (Webhook/Callback from payment gateway)
exports.processPaymentSuccess = asyncHandler(async (req, res) => {
    const { booking_id, transaction_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify Razorpay signature if using Razorpay
    if (razorpay_order_id && razorpay_payment_id) {
        await PaymentService.verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        
        const result = await PaymentService.processPaymentSuccess(booking_id, razorpay_payment_id, {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature
        });

        return res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: result
        });
    }

    // For other payment methods
    const result = await PaymentService.processPaymentSuccess(booking_id, transaction_id);

    res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: result
    });
});

// Handle payment failure
exports.processPaymentFailure = asyncHandler(async (req, res) => {
    const { booking_id, error_message } = req.body;

    const result = await PaymentService.processPaymentFailure(booking_id, error_message);

    res.status(400).json({
        success: false,
        message: 'Payment failed',
        data: result
    });
});

// Get payment details
exports.getPaymentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payment = await PaymentService.getPaymentDetails(id);

    res.status(200).json({
        success: true,
        data: payment
    });
});

// Process refund
exports.processRefund = asyncHandler(async (req, res) => {
    const { payment_id, refund_amount } = req.body;

    const result = await PaymentService.refundPayment(payment_id, refund_amount);

    res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: result
    });
});

// Get payment statistics (admin)
exports.getPaymentStatistics = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;

    const stats = await PaymentService.getStatistics(start_date, end_date);

    res.status(200).json({
        success: true,
        data: stats
    });
});

// Get payments by status (admin)
exports.getPaymentsByStatus = asyncHandler(async (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;

    const payments = await PaymentService.getPaymentsByStatus(
        status,
        parseInt(limit),
        parseInt(offset)
    );

    res.status(200).json({
        success: true,
        data: payments,
        count: payments.length
    });
});
