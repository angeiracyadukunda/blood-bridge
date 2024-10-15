const { db } = require('../firebase/firebaseAdmin'); // Firebase Admin SDK instance
const { v4: uuidv4 } = require('uuid');
const { FieldValue } = require('firebase-admin/firestore');
const appModel = "../models/appointmentModel";
const {createAppointment} = require(appModel)
// Create a new appointment
const createAppointmentController = async (req, res) => {
    try {
        const { province, district, sector, phone, centerId, bloodGroup,scheduleDate, scheduleTime, notes } = req.body;

        const appointmentId = uuidv4();
        const uid  = req.params.uid;
        // console.log("The Center id in the model is: "+centerId);
        // console.log("The uid in the model is: "+uid);
        const appointment = {
            donorId: uid,
            centerId,
            scheduleTime,
            scheduleDate,
            notes,
        };
        const newAppointment = createAppointment(appointmentId, appointment);
        // await db.collection('appointments').doc(appointmentId).set(appointment);
        await db.collection('appointments').doc(appointmentId).set(newAppointment); 
        // Update donor's record with new appointment ID
        const donorRef = db.collection('donors').doc(uid);
        await donorRef.update({
            bloodGroup,
            sector,
            province,
            district,
            phoneNo: phone,
            appointments: FieldValue.arrayUnion(appointmentId),
            updatedAt: FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: 'Appointment scheduled successfully', id: appointmentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to schedule appointment.' });
    }
};

// Fetch all appointments
const getAllAppointmentsController = async (req, res) => {
    try {
        // Assuming the user ID is stored in the session, accessed via req.session
        const userId = req.session.user.uid; // Accessing userId from the session

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Fetch all donation centers
        const centerSnapshot = await db.collection('donationCenters').get();
        const centers = centerSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
        }));

        // Fetch all appointments
        const appointmentsSnapshot = await db.collection('appointments').get();
        const appointmentsDb = appointmentsSnapshot.docs.map(doc => doc.data());

        // Filter and map over the appointments to include only those for the authenticated user
        const appointments = appointmentsDb
            .filter(appointment => appointment.donorId === userId) // Filter by donorId from the session
            .map(appointment => {
                const center = centers.find(c => c.id === appointment.centerId); // Find the matching center by ID
                return {
                    ...appointment,
                    centerName: center ? center.name : 'Unknown Center' // Add center name or 'Unknown Center' if not found
                };
            });

        // console.log("Filtered appointments for user " + userId + ": " + JSON.stringify(appointments));

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
};


// Fetch a single appointment by ID
const getAppointmentController = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointmentSnapshot = await db.collection('appointments').doc(appointmentId).get();
        if (!appointmentSnapshot.exists) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointmentSnapshot.data());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch appointment.' });
    }
};

// Edit an appointment
const editAppointmentController = async (req, res) => {
    try {
        const { province, district, sector, phone, scheduleTime, notes } = req.body;
        const appointmentId = req.params.id;

        const appointmentRef = db.collection('appointments').doc(appointmentId);
        await appointmentRef.update({
            scheduleTime,
            notes,
            province,
            district,
            sector,
            phoneNo: phone,
            updatedAt: FieldValue.serverTimestamp(),
        });

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update appointment.' });
    }
};

// Delete an appointment
const deleteAppointmentController = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Delete the appointment from the 'appointments' collection
        const appointmentToDelete = await db.collection('appointments').doc(appointmentId);
        const appointmentSnapshot = await appointmentToDelete.get();
        let userId="";
        if (appointmentSnapshot.exists) {
            userId = appointmentSnapshot.data().donorId;
            
            // Now, delete the appointment
            await appointmentToDelete.delete();
            
            // console.log(`Appointment with ID ${appointmentId} for donor ${userId} has been deleted.`);
        } 
        // else {
        //     console.log(`Appointment with ID ${appointmentId} does not exist.`);
        // }
        
        // Remove the appointment from the donor's list
        const donorRef = db.collection('donors').doc(userId);
        await donorRef.update({
            appointments: FieldValue.arrayRemove(appointmentId),
        });

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete appointment.' });
    }
};

// Fetch all donation centers
const getDonationCentersController = async (req, res) => {
    try {
        const centersSnapshot = await db.collection('donation_centers').get();
        const centers = centersSnapshot.docs.map(doc => doc.data());
        res.status(200).json(centers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch donation centers.' });
    }
};

// Fetch all available schedules
const getSchedulesController = async (req, res) => {
    try {
        const schedulesSnapshot = await db.collection('schedules').get();
        const schedules = schedulesSnapshot.docs.map(doc => doc.data());
        res.status(200).json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch schedules.' });
    }
};

module.exports = {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentController,
    editAppointmentController,
    deleteAppointmentController,
    getDonationCentersController,
    getSchedulesController,
};
