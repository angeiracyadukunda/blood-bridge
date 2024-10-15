const express = require('express');
const { signupUser, signupSuccess, verifyEmailLink } = require('../controllers/userController');
const { registerDonor, checkRegistrationComplete, checkAlreadyRegistered } = require('../controllers/registerController');
const router = express.Router();

// Route for signup
router.post('/signup', signupUser);

// Route for signup success page
router.get('/signup-success', signupSuccess);

// Route for email verification
router.get('/verify-email', verifyEmailLink);

router.post('/register', registerDonor);

router.get('/registration-success', checkAlreadyRegistered, checkRegistrationComplete, (req, res) => {
    const now = Date.now();
    req.session.registrationComplete = true;
    req.session.registrationTime = now; 
   
    res.render('registration-success');
});

module.exports = router;