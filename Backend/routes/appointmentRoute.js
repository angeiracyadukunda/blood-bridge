const express = require('express');
const {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentController,
    editAppointmentController,
    deleteAppointmentController,
    getDonationCentersController,
    getSchedulesController,
} = require('../controllers/appointmentsController');

const router = express.Router();

// Get all appointments
router.get('/appointments', getAllAppointmentsController);

// Get a specific appointment by ID
router.get('/appointments/:id', getAppointmentController);

// Create a new appointment
router.post('/:uid/appointments', createAppointmentController);

// Edit an existing appointment
router.put('/appointments/edit/:id', editAppointmentController);

// Delete an appointment
router.delete('/appointments/delete/:id', deleteAppointmentController);

// Get all donation centers
router.get('/donation-centers', getDonationCentersController);

// Get all available schedules
router.get('/schedules', getSchedulesController);

module.exports = router;
