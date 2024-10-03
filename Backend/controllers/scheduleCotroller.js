const { createSchedules } = require('../models/scheduleModel'); // Adjust the path as needed
const { db } = require('../firebase/firebaseAdmin'); // Adjust the path accordingly
const { v4: uuidv4 } = require('uuid'); 
// Fetch all schedules
const getSchedules = async (req, res) => {
    try {

        // Fetch schedules from the Firestore database
        const schedulesSnapshot = await db.collection('schedules').get();
        const schedules = schedulesSnapshot.docs.map(doc => ({ scheduleId: doc.id, ...doc.data() }));

        // Send the schedules as a response
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
};

// Add a new schedule
const addSchedule = async (req, res) => {
    try {
        const { date, timeRange } = req.body;
        const data = { date, timeRange };
        // Generate a unique scheduleId
        const scheduleId = uuidv4(); 

        // Use the createSchedules model function to create the schedule object
        const schedule = createSchedules(scheduleId, data);

        // Save the schedule to Firestore using scheduleId as the document ID
        await db.collection('schedules').doc(scheduleId).set(schedule); 

        res.status(201).json({ message: 'Schedule created successfully', scheduleId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule', error });
    }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        // Delete the schedule by its ID
        await db.collection('schedules').doc(scheduleId).delete();

        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error });
    }
};
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { date, timeRange } = req.body;

    try {
        const scheduleRef = db.collection('schedules').doc(id); // Get the document reference for the schedule
        const scheduleDoc = await scheduleRef.get();

        if (!scheduleDoc.exists) {
            return res.status(404).json({ message: 'Schedule not found' }); // If the schedule doesn't exist, return 404
        }

        // Update the schedule
        await scheduleRef.update({
            date,
            timeRange,
            updatedAt: new Date(), // Optionally add a field for the update time
        });

        res.json({ message: 'Schedule updated successfully', scheduleId: id }); // Return a success message
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
};

module.exports = {
    getSchedules,
    addSchedule,
    deleteSchedule,
    updateSchedule
};
