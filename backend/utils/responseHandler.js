// ============================================================
// API RESPONSE UTILITY
// Standardized response formatting for all endpoints
// ============================================================

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        status: 'success',
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

const sendError = (res, message = 'Error', errors = [], statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        status: 'error',
        message,
        errors: Array.isArray(errors) ? errors : [errors],
        timestamp: new Date().toISOString()
    });
};

const sendPaginatedResponse = (res, data, pagination, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        status: 'success',
        message,
        data,
        pagination: {
            total: pagination.total,
            limit: pagination.limit,
            offset: pagination.offset,
            page: Math.floor(pagination.offset / pagination.limit) + 1,
            pages: Math.ceil(pagination.total / pagination.limit)
        },
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendPaginatedResponse
};
