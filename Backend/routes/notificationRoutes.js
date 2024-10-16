const express = require('express');
const router = express.Router();
const { sendNotificationToUsers, fetchVerifiedDonors } = require('../controllers/notifyController');

// Route to get the list of donors
router.get('/sendNotification/getDonors', fetchVerifiedDonors);

// Route to send a notification
router.post('/sendNotification/send', sendNotificationToUsers);

module.exports = router;
