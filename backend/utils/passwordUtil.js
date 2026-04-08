// ============================================================
// PASSWORD HASHING UTILITY - BCRYPT
// ============================================================

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// Hash password
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('✗ Error hashing password:', error.message);
        throw error;
    }
}

// Compare password with hashed password
async function comparePassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('✗ Error comparing password:', error.message);
        throw error;
    }
}

// Validate password strength
function validatePasswordStrength(password) {
    const errors = [];

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>?,./\\|-]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

module.exports = {
    hashPassword,
    comparePassword,
    validatePasswordStrength
};
