const express = require('express');
const router = express.Router();
const { getAnnouncements } = require('../controllers/newsController');

// Route to fetch all announcements
router.get('/show/announcements', getAnnouncements);

module.exports = router;