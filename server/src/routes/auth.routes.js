const express = require('express');
const router = express.Router();

// Import the controller and middleware
const authController = require('../controllers/auth.controller') || {};
const authMiddleware = require('../middleware/auth.middleware') || {};
const authenticateToken = authMiddleware.authenticateToken || ((req, res, next) => next());

// Safe handler wrappers to prevent the server from crashing if something is missing in the controller.
const safeHandler = (handlerName) => {
    return (req, res, next) => {
        if (typeof authController[handlerName] === 'function') {
            return authController[handlerName](req, res, next);
        }
        res.status(501).json({
            error: "Not Implemented",
            message: `Controller function '${handlerName}' is not defined yet.`
        });
    };
};

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/signup', safeHandler('signup'));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login and get JWT Access Token
 * @access  Public
 */
router.post('/login', safeHandler('login'));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get profile details of the logged-in user
 * @access  Private (Requires Bearer Token)
 */
router.get('/me', authenticateToken, safeHandler('getMe'));

module.exports = router;