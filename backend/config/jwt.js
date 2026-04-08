// ============================================================
// JWT CONFIGURATION
// ============================================================

const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
};

// Generate Access Token
function generateAccessToken(userId, email, role) {
    return jwt.sign(
        { userId, email, role },
        JWT_CONFIG.secret,
        { expiresIn: JWT_CONFIG.expiresIn }
    );
}

// Generate Refresh Token
function generateRefreshToken(userId) {
    return jwt.sign(
        { userId },
        JWT_CONFIG.refreshSecret,
        { expiresIn: JWT_CONFIG.refreshExpiresIn }
    );
}

// Verify Access Token
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
        return null;
    }
}

// Verify Refresh Token
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, JWT_CONFIG.refreshSecret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    JWT_CONFIG,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
