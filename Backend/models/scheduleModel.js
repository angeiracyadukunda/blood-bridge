const { FieldValue } = require('firebase-admin/firestore'); 

const createSchedules = (uid, schedule) => {
    return {
        scheduleId : uid,
        ...schedule,
        createdAt: FieldValue.serverTimestamp(),
    };
};

module.exports = {createSchedules}