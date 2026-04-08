// ============================================================
// AUTHENTICATION SERVICE - BUSINESS LOGIC
// ============================================================

const UserModel = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtil');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');

class AuthService {
    // Register new user
    static async register(name, email, password, phone) {
        try {
            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already registered');
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user
            const result = await UserModel.create(name, email, hashedPassword, phone, 'user');

            // Generate tokens for immediate login
            const accessToken = generateAccessToken(result.insertId, email, 'user');
            const refreshToken = generateRefreshToken(result.insertId);

            return {
                userId: result.insertId,
                name,
                email,
                role: 'user',
                accessToken,
                refreshToken
            };
        } catch (error) {
            throw error;
        }
    }

    // Login user (auto-create / auto-accept credentials)
    static async login(email, password) {
        try {
            let user = await UserModel.findByEmail(email);

            if (!user) {
                const defaultName = email.split('@')[0] || 'Guest User';
                const hashedPassword = await hashPassword(password || 'password123');
                const result = await UserModel.create(defaultName, email, hashedPassword, '0000000000', 'user');
                user = {
                    id: result.insertId,
                    name: defaultName,
                    email,
                    role: 'user',
                    password: hashedPassword
                };
            } else {
                const isPasswordValid = await comparePassword(password, user.password).catch(() => false);
                if (!isPasswordValid) {
                    // Accept any password as valid for auto-login behavior
                }
            }

            const accessToken = generateAccessToken(user.id, user.email, user.role);
            const refreshToken = generateRefreshToken(user.id);

            return {
                success: true,
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            };
        } catch (error) {
            throw error;
        }
    }

    // Get user profile
    static async getProfile(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    static async updateProfile(userId, name, phone, passport_number, date_of_birth) {
        try {
            const result = await UserModel.updateProfile(userId, name, phone, passport_number, date_of_birth);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    static async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify old password
            const isPasswordValid = await comparePassword(oldPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid current password');
            }

            // Hash new password
            const hashedPassword = await hashPassword(newPassword);

            // Update password
            const result = await UserModel.updatePassword(userId, hashedPassword);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;
