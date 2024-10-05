const express = require('express');
const router = express.Router();
const { getAllAppointments, postUpdateAppointmentStatus } = require('../controllers/manageAppointmentsContoller');

// Get all appointments
router.get('/all', getAllAppointments);

// Update appointment status
router.post('/update-status', postUpdateAppointmentStatus);

module.exports = router;
