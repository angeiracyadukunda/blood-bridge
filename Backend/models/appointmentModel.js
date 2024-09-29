const { serverTimestamp } = require('firebase/firestore');

const createAppointment = (uid, appointmentData) => {
    return {
        appointmentId: uid,
        ...appointmentData,
        status: "pending",
        reason: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
};

module.exports = {createAppointment};