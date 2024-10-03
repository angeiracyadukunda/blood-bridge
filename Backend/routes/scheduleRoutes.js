const express = require('express');
const { getSchedules, addSchedule, deleteSchedule, updateSchedule } = require('../controllers/scheduleCotroller');
const router = express.Router();

// Fetch all schedules (admin only)
router.get('/schedules', getSchedules);

// Add a new schedule (admin only)
router.post('/schedules', addSchedule);

// Delete a schedule (admin only)
router.delete('/schedules/:id', deleteSchedule);

router.put('/schedules/:id', updateSchedule);

module.exports = router;
