// ============================================================
// VALIDATORS UTILITY
// Input validation for all API endpoints
// ============================================================

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[^\d]/g, ''));
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const validateBookingData = (data) => {
    const errors = [];

    if (!data.passenger_name || data.passenger_name.trim().length === 0) {
        errors.push('Passenger name is required');
    }

    if (!data.passenger_email || !validateEmail(data.passenger_email)) {
        errors.push('Valid email is required');
    }

    if (!data.passenger_phone || !validatePhone(data.passenger_phone)) {
        errors.push('Valid 10-digit phone number is required');
    }

    if (!data.flight_id || isNaN(data.flight_id)) {
        errors.push('Valid flight ID is required');
    }

    if (!data.seat_id || isNaN(data.seat_id)) {
        errors.push('Valid seat ID is required');
    }

    if (!data.total_amount || data.total_amount <= 0) {
        errors.push('Valid amount is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateFlightSearch = (data) => {
    const errors = [];

    if (!data.origin || data.origin.trim().length === 0) {
        errors.push('Origin airport code is required');
    }

    if (!data.destination || data.destination.trim().length === 0) {
        errors.push('Destination airport code is required');
    }

    if (!data.departure_date) {
        errors.push('Departure date is required');
    } else {
        const date = new Date(data.departure_date);
        if (isNaN(date.getTime()) || date < new Date()) {
            errors.push('Valid future departure date is required');
        }
    }

    if (data.passengers && data.passengers < 1) {
        errors.push('At least one passenger is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validatePaymentData = (data) => {
    const errors = [];

    if (!data.booking_id || isNaN(data.booking_id)) {
        errors.push('Valid booking ID is required');
    }

    if (!data.amount || data.amount <= 0) {
        errors.push('Valid amount is required');
    }

    const validMethods = ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet'];
    if (!data.payment_method || !validMethods.includes(data.payment_method)) {
        errors.push('Valid payment method is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword,
    validateBookingData,
    validateFlightSearch,
    validatePaymentData
};
