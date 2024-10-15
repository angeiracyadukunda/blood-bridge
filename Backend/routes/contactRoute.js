const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');

// Contact form route (send message)
router.post('/contact', sendMessage);

module.exports = router;
