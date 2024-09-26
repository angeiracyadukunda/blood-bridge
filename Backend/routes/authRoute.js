const express = require('express');
const { signupUser, signupSuccess, verifyEmail } = require('../controllers/authController');
const router = express.Router();

// Route for signup
router.post('/signup', signupUser);

// Route for signup success page
router.get('/signup-success', signupSuccess);

// Route for email verification
router.get('/verify', verifyEmail);

module.exports = router;
