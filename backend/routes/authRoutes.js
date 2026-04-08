// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authValidations } = require('../middleware/validation');

// Public routes
router.post('/register', authValidations.register, authController.register);
router.post('/login', authValidations.login, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
