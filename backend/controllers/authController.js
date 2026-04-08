// ============================================================
// AUTHENTICATION CONTROLLER
// ============================================================

const AuthService = require('../services/AuthService');
const { asyncHandler } = require('../middleware/errorHandler');

// Register endpoint
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const user = await AuthService.register(name, email, password, phone);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
    });
});

// Login endpoint
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
    });
});

// Get profile
exports.getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const profile = await AuthService.getProfile(userId);

    res.status(200).json({
        success: true,
        data: profile
    });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { name, phone, passport_number, date_of_birth } = req.body;

    await AuthService.updateProfile(userId, name, phone, passport_number, date_of_birth);

    const updatedProfile = await AuthService.getProfile(userId);

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
    });
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'New password and confirm password do not match'
        });
    }

    await AuthService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});
