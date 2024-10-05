const { FieldValue } = require('firebase-admin/firestore');
const {db} = require("../firebase/firebaseAdmin");


// Fetch all appointments with donor and center info
const getAppointments = async () => {
    const appointmentSnapshot = await db.collection('appointments').get();
    const appointments = [];

    for (const doc of appointmentSnapshot.docs) {
        const appointment = doc.data();
        const donorDoc = await db.collection('users').doc(appointment.donorId).get();
        const centerDoc = await db.collection('donationCenters').doc(appointment.centerId).get();

        appointments.push({
            appointmentId: doc.id,
            fullName: donorDoc.data().fullName,
            centerName: centerDoc.data().name,
            scheduleDate: appointment.scheduleDate,
            scheduleTime: appointment.scheduleTime,
            status: appointment.status,
        });
    }
    return appointments;
};

// Update appointment status
const postUpdateAppointmentStatus = async (req, res) => {
    const { appointmentId, status } = req.body;
    console.log(`Updating appointment ${appointmentId} to ${status}`);
    try {
        const appointmentRef = db.collection('appointments').doc(appointmentId);
        await appointmentRef.update({
            status: status,
            updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`Appointment ${appointmentId} updated to ${status}`);
        res.status(200).send('Appointment status updated successfully');
    } catch (error) {
        console.error("Error updating appointment:", error);
    }
};

// Fetch all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await getAppointments();
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments');
    }
};

// Update appointment status
// const postUpdateAppointmentStatus = async (req, res) => {
//     const { appointmentId, status } = req.body;
//     try {
//         await updateAppointmentStatus(appointmentId, status);
//         res.status(200).send('Appointment status updated successfully');
//     } catch (error) {
//         console.error('Error updating appointment status:', error);
//         res.status(500).send('Error updating appointment status');
//     }
// };

module.exports = { getAllAppointments, postUpdateAppointmentStatus };
