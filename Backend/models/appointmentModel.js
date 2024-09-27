const { serverTimestamp } = require('firebase/firestore');

const createAppointmentData = (appointmentId, appointmentDetails) => {
    return {
        appointmentId: appointmentId,  // Unique identifier for the appointment
        donorId: appointmentDetails.donorId,  // Firebase UID of the donor
        recipientId: appointmentDetails.recipientId || null,  // Firebase UID of the recipient/organization
        preferredDate: appointmentDetails.preferredDate,  // Date of the appointment
        preferredTime: appointmentDetails.preferredTime,  // Time of the appointment
        bloodQuantity: appointmentDetails.bloodQuantity || 0,  // Quantity of blood in liters
        status: appointmentDetails.status || 'pending',  // Default status is 'pending'
        createdAt: serverTimestamp(),  // Timestamp of creation
        updatedAt: serverTimestamp()   // Timestamp of the last update
    };
};

module.exports = { createAppointmentData };
