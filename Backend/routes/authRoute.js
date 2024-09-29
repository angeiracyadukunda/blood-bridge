const express = require('express');
const { signupUser, signupSuccess, verifyEmailLink } = require('../controllers/authController');
const router = express.Router();

// Route for signup
router.post('/signup1', signupUser);

// Route for signup success page
router.get('/signup-success', signupSuccess);

// Route for email verification
router.get('/verify-email', verifyEmailLink);

module.exports = router;
