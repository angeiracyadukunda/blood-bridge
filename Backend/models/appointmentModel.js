const { FieldValue } = require('firebase-admin/firestore');

const createAppointment = (appointmentId, appointment) => {
    return {
        appointmentId,
        donorId: appointment.donorId,           // Reference to donors table
        centerId: appointment.centerId,          // Reference to donation centers table
        scheduleTime: appointment.scheduleTime, 
        scheduleDate: appointment.scheduleDate,       // Reference to schedule table
        notes: appointment.notes,
        status: "pending",
        reason: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };
};

module.exports = { createAppointment };
