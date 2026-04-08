// ============================================================
// PAYMENT ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { paymentValidations } = require('../middleware/validation');

// Protected routes (user must be authenticated)
router.post('/initiate', authenticateToken, paymentValidations.processPayment, paymentController.initiatePayment);
router.get('/:id', authenticateToken, paymentController.getPaymentDetails);

// Payment gateway callbacks (can be public or secured with webhook secret)
router.post('/success', paymentController.processPaymentSuccess);
router.post('/failure', paymentController.processPaymentFailure);

// Admin routes
router.post('/:id/refund', authenticateToken, authorizeAdmin, paymentController.processRefund);
router.get('/admin/statistics', authenticateToken, authorizeAdmin, paymentController.getPaymentStatistics);
router.get('/admin/by-status', authenticateToken, authorizeAdmin, paymentController.getPaymentsByStatus);

module.exports = router;
