// ============================================================
// EMAIL UTILITY - NODEMAILER
// ============================================================

const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test email connection
async function testEmailConnection() {
    try {
        await transporter.verify();
        console.log('✓ Email service configured successfully');
        return true;
    } catch (error) {
        console.warn('⚠ Email service not configured:', error.message);
        return false;
    }
}

// Send booking confirmation email
async function sendBookingConfirmation(email, bookingDetails) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Booking Confirmation - ${bookingDetails.booking_reference}`,
            html: `
                <h2>Flight Booking Confirmation</h2>
                <p>Dear ${bookingDetails.passenger_name},</p>
                <p>Your booking has been confirmed successfully!</p>
                <hr>
                <h3>Booking Details:</h3>
                <ul>
                    <li><strong>Booking Reference:</strong> ${bookingDetails.booking_reference}</li>
                    <li><strong>Flight Number:</strong> ${bookingDetails.flight_number}</li>
                    <li><strong>From:</strong> ${bookingDetails.origin}</li>
                    <li><strong>To:</strong> ${bookingDetails.destination}</li>
                    <li><strong>Departure:</strong> ${bookingDetails.departure_time}</li>
                    <li><strong>Seat:</strong> ${bookingDetails.seat_number}</li>
                    <li><strong>Total Amount:</strong> ₹${bookingDetails.total_amount}</li>
                </ul>
                <hr>
                <p>Your boarding pass is attached to this email.</p>
                <p>Best regards,<br>Indian Airlines Booking System</p>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✓ Booking confirmation email sent');
        return result;
    } catch (error) {
        console.error('✗ Error sending email:', error.message);
        throw error;
    }
}

// Send payment confirmation email
async function sendPaymentConfirmation(email, paymentDetails) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Payment Confirmation - Transaction ID: ${paymentDetails.transaction_id}`,
            html: `
                <h2>Payment Confirmation</h2>
                <p>Dear ${paymentDetails.passenger_name},</p>
                <p>Your payment has been received and processed successfully!</p>
                <hr>
                <h3>Payment Details:</h3>
                <ul>
                    <li><strong>Transaction ID:</strong> ${paymentDetails.transaction_id}</li>
                    <li><strong>Amount:</strong> ₹${paymentDetails.amount}</li>
                    <li><strong>Payment Method:</strong> ${paymentDetails.payment_method}</li>
                    <li><strong>Status:</strong> ${paymentDetails.payment_status}</li>
                    <li><strong>Booking Reference:</strong> ${paymentDetails.booking_reference}</li>
                </ul>
                <hr>
                <p>Thank you for choosing Indian Airlines!</p>
                <p>Best regards,<br>Indian Airlines Booking System</p>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✓ Payment confirmation email sent');
        return result;
    } catch (error) {
        console.error('✗ Error sending email:', error.message);
        throw error;
    }
}

// Send flight update notification
async function sendFlightUpdate(email, flightDetails) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Flight Update - ${flightDetails.flight_number}`,
            html: `
                <h2>Flight Status Update</h2>
                <p>Dear ${flightDetails.passenger_name},</p>
                <p>We have an update regarding your upcoming flight.</p>
                <hr>
                <h3>Flight Details:</h3>
                <ul>
                    <li><strong>Flight Number:</strong> ${flightDetails.flight_number}</li>
                    <li><strong>Route:</strong> ${flightDetails.origin} → ${flightDetails.destination}</li>
                    <li><strong>Current Status:</strong> ${flightDetails.status}</li>
                    <li><strong>Original Departure:</strong> ${flightDetails.departure_time}</li>
                    <li><strong>Updated Time:</strong> ${flightDetails.updated_time}</li>
                </ul>
                <hr>
                <p>Please check your booking for more details.</p>
                <p>Best regards,<br>Indian Airlines Booking System</p>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✓ Flight update email sent');
        return result;
    } catch (error) {
        console.error('✗ Error sending email:', error.message);
        throw error;
    }
}

// Generic email sender
async function sendEmail(to, subject, html) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('✗ Error sending email:', error.message);
        throw error;
    }
}

module.exports = {
    testEmailConnection,
    sendBookingConfirmation,
    sendPaymentConfirmation,
    sendFlightUpdate,
    sendEmail
};
