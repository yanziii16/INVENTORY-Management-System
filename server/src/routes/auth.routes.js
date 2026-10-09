const express = require('express');
const router = express.Router();

// Import the controller and middleware
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/signup', authController.signup);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login and get JWT Access Token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get profile details of the logged-in user
 * @access  Private (Requires Bearer Token)
 */
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;