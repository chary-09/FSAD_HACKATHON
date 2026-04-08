// ============================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================

// Async error wrapper - wrap async route handlers
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Custom API Error class
class APIError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Central error handling middleware
function errorHandler(err, req, res, next) {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Database errors
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Duplicate entry';
    }

    // 404 Not Found
    if (err.statusCode === 404) {
        statusCode = 404;
        message = err.message || 'Resource not found';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
}

// 404 handler
function notFound(req, res, next) {
    const error = new APIError(`Route not found: ${req.originalUrl}`, 404);
    next(error);
}

module.exports = {
    asyncHandler,
    APIError,
    errorHandler,
    notFound
};
