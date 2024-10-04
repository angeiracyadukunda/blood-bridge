const express = require('express');
const router = express.Router();
const {
    listDonations,
    addDonation,
    getDonorDetails,
    listAppointments,
    updateAppointmentStatus
} = require('../controllers/manageDonationsController'); // Adjust the path as necessary

// Donation routes
router.get('/list', listDonations);
router.post('/add', addDonation);
router.get('/donor/:id', getDonorDetails);

// Appointment routes
router.get('/appointments/list', listAppointments);
router.put('/appointments/update/:id', updateAppointmentStatus);

module.exports = router;
