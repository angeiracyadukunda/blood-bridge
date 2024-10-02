const express = require('express');
const { getSchedules, addSchedule, deleteSchedule } = require('../controllers/scheduleCotroller');
const router = express.Router();

// Fetch all schedules (admin only)
router.get('/schedules', getSchedules);

// Add a new schedule (admin only)
router.post('/schedules', addSchedule);

// Delete a schedule (admin only)
router.delete('/schedules/:id', deleteSchedule);

module.exports = router;
