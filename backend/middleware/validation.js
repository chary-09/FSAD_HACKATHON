// ============================================================
// INPUT VALIDATION MIDDLEWARE
// ============================================================

const { body, validationResult } = require('express-validator');

// Validation result handler
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
}

// ============================================================
// VALIDATION RULES
// ============================================================

const authValidations = {
    register: [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').matches(/\d/).withMessage('Password must contain at least one number'),
        body('phone').trim().notEmpty().withMessage('Phone number is required').matches(/^\+?[0-9\s-]{10,15}$/).withMessage('Invalid phone number'),
        handleValidationErrors
    ],
    login: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        handleValidationErrors
    ]
};

const flightValidations = {
    createFlight: [
        body('airline_id').isInt({ min: 1 }).withMessage('Valid airline ID is required'),
        body('aircraft_id').isInt({ min: 1 }).withMessage('Valid aircraft ID is required'),
        body('flight_number').trim().notEmpty().withMessage('Flight number is required'),
        body('origin').trim().notEmpty().withMessage('Origin is required'),
        body('destination').trim().notEmpty().withMessage('Destination is required'),
        body('departure_time').isISO8601().withMessage('Valid departure time is required'),
        body('arrival_time').isISO8601().withMessage('Valid arrival time is required'),
        body('price_economy').isDecimal({ min: 0 }).withMessage('Valid economy price is required'),
        body('price_business').isDecimal({ min: 0 }).withMessage('Valid business price is required'),
        handleValidationErrors
    ],
    searchFlights: [
        body('origin').trim().notEmpty().withMessage('Origin is required'),
        body('destination').trim().notEmpty().withMessage('Destination is required'),
        body('departure_date').isISO8601().withMessage('Valid departure date is required'),
        body('trip_type').isIn(['oneway', 'roundtrip']).withMessage('Invalid trip type'),
        handleValidationErrors
    ]
};

const bookingValidations = {
    createBooking: [
        body('flight_id').isInt({ min: 1 }).withMessage('Valid flight ID is required'),
        body('seat_id').isInt({ min: 1 }).withMessage('Valid seat ID is required'),
        body('passenger_name').trim().notEmpty().withMessage('Passenger name is required'),
        body('passenger_email').isEmail().withMessage('Valid email is required'),
        body('passenger_phone').optional().matches(/^[0-9]{10,12}$/).withMessage('Invalid phone number'),
        handleValidationErrors
    ]
};

const paymentValidations = {
    processPayment: [
        body('booking_id').isInt({ min: 1 }).withMessage('Valid booking ID is required'),
        body('amount').isDecimal({ min: 0 }).withMessage('Valid amount is required'),
        body('payment_method').isIn(['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet']).withMessage('Invalid payment method'),
        handleValidationErrors
    ]
};

module.exports = {
    handleValidationErrors,
    authValidations,
    flightValidations,
    bookingValidations,
    paymentValidations
};
