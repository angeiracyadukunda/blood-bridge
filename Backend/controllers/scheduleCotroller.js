const { createSchedules } = require('../models/scheduleModel'); // Adjust the path as needed
const { db } = require('../firebase/firebaseAdmin'); // Adjust the path accordingly

// Fetch all schedules
const getSchedules = async (req, res) => {
    try {
        // Ensure the user is an admin
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        const schedulesSnapshot = await db.collection('schedules').get();
        const schedules = schedulesSnapshot.docs.map(doc => ({ scheduleId: doc.id, ...doc.data() }));
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
};

// Add a new schedule
const addSchedule = async (req, res) => {
    try {
        const { date, timeRange } = req.body;

        // Ensure the user is an admin
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        const schedule = createSchedules(req.user.uid, { date, timeRange });

        await db.collection('schedules').add(schedule);
        res.status(201).json({ message: 'Schedule created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule', error });
    }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;

        // Ensure the user is an admin
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        await db.collection('schedules').doc(scheduleId).delete();
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error });
    }
};

module.exports = {
    getSchedules,
    addSchedule,
    deleteSchedule,
};
