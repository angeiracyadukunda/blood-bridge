const express = require('express');
const { signupUser } = require('../controllers/userController');
const router = express.Router();

// Route to handle user signup
router.post('/signup', signupUser);

module.exports = router;
