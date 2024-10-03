const { FieldValue } = require('firebase-admin/firestore'); 

const createSchedules = (uid, schedule) => {
    return {
        scheduleId: uid, // Associate the schedule with the user's ID
        date: schedule.date, // Store the date of the schedule
        timeRange: schedule.timeRange, // Store the time range
        createdAt: FieldValue.serverTimestamp(), // Auto-generate timestamp on server
    };
};

module.exports = {createSchedules}