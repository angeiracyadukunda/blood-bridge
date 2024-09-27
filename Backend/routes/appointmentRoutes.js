const express = require('express');

const { scheduleAppointment } = require('../controllers/appointmentControllers'); // Import the controller
const router = express.Router();

// Route to schedule an appointment
router.post('/schedule-appointment', scheduleAppointment);

module.exports = router;
