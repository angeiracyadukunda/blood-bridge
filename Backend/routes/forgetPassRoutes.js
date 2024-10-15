const express = require('express');
const router = express.Router();
const {
    sendResetLink,
    resetPassword,
    getResetPasswordPage,
} = require('../controllers/forgetpassController');

// Forgot password route (send reset link)
router.post('/forgot-password', sendResetLink);

// Reset password route (handle password reset)
router.post('/reset-password', resetPassword);

// GET route to serve the reset password page
router.get('/reset-password', getResetPasswordPage);

module.exports = router;
