// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

const { verifyAccessToken } = require('../config/jwt');

// Verify JWT Token
async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
}

// Verify Admin Role
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
}

// Verify User or Admin Role
function authorizeUserOrAdmin(req, res, next) {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    next();
}

// Verify Airline Staff or Admin
function authorizeAirlineStaff(req, res, next) {
    if (req.user.role !== 'airline_staff' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Airline staff access required'
        });
    }
    next();
}

module.exports = {
    authenticateToken,
    authorizeAdmin,
    authorizeUserOrAdmin,
    authorizeAirlineStaff
};
