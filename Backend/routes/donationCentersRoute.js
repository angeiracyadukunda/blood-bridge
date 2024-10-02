const express = require('express');
const router = express.Router();
const {
    getDonationCenters,
    addDonationCenter,
    updateDonationCenter,
    getDonationCenter,
} = require('../controllers/donationCentersController');

// Define the routes
router.get('/donation-centers', getDonationCenters);
router.get('/donation-centers/:id', getDonationCenter);
router.post('/donation-centers', addDonationCenter);
router.put('/donation-centers/:id', updateDonationCenter);

// Export the router
module.exports = router;
