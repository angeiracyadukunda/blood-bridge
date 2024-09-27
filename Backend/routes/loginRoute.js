const express = require('express');
const { loginUser, checkUserSession, logoutUser } = require('../controllers/loginController');

const router = express.Router();

// POST: Login User
router.post('/login', loginUser);

// GET: Check if user is logged in
router.get('/session', checkUserSession);

// POST: Logout User
router.post('/logout', logoutUser);

router.get('/logout', logoutUser);

module.exports = router;