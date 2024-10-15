const { db } = require('../firebase/firebaseAdmin');  // Assumes you've already set up Firebase Admin SDK
const {createDonation} =require("../models/donationModel")
const { v4: uuidv4 } = require('uuid');
const { FieldValue } = require('firebase-admin/firestore');

// List all donations
const listDonations = async (req, res) => {
    try {
        const donationsSnapshot = await db.collection('donations').get();
        const donations = [];

        for (const doc of donationsSnapshot.docs) {
            const donationData = { id: doc.id, ...doc.data() };
            const donorId = donationData.donorId;

            // Fetch the user's fullName from the "users" collection using the donorId
            const userSnapshot = await db.collection('users').doc(donorId).get();

            if (userSnapshot.exists) {
                const userData = userSnapshot.data();
                const fullName = userData.fullName; // Get the fullName from the user data

                // Add the fullName to the donation data
                donationData.fullName = fullName;
            } else {
                console.warn(`User not found for donorId: ${donorId}`);
                donationData.fullName = "Unknown"; // Or handle as needed
            }

            donations.push(donationData);
        }

        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
};


// Add a new donation
const addDonation = async (req, res) => {
    try {
        ("Received request to add donation:", req.body); // Log the incoming request body

        const { donorId, donationDate, bloodQuantity, donationCenter, rhesus, firstBloodCheck, secondBloodCheck, doctorName, signature } = req.body;

        // Check for missing fields
        if (!donorId || !donationDate || !bloodQuantity || !donationCenter || !rhesus || !firstBloodCheck || !secondBloodCheck || !doctorName || !signature) {
            console.error("Missing required fields:", { donorId, donationDate, bloodQuantity, donationCenter, rhesus, firstBloodCheck, secondBloodCheck, doctorName, signature });
            return res.status(400).json({ error: 'All fields are required' });
        }
        const donationId = uuidv4();
        const donationData = createDonation (donationId, {
            donorId,
            donationDate, // Ensure the date is properly formatted
            bloodQuantity,
            donationCenter,
            rhesus,
            firstBloodCheck,
            secondBloodCheck,
            doctorName,
            signature
        })
        
        // Log the donation data before adding to the database
        // console.log("Adding donation data to the database:", donationData);

        const donationRef = await db.collection('donations').doc(donationId).set(donationData);
        
        // Log the successful addition
        // console.log("Donation added successfully with ID:", donationRef.id);
        
        const donorRef = db.collection('donors').doc(donorId);
        const donorSnapshot = await donorRef.get();

        if (!donorSnapshot.exists) {
            console.error("Donor not found:", donorId);
            return res.status(404).json({ error: 'Donor not found' });
        }

        const donorData = donorSnapshot.data();
        const currentRewards = Number(donorData.rewards) || 0; // Ensure current rewards is a number
        const updatedRewards = currentRewards + 1; // Increment rewards by 1

        await donorRef.update({ 
            rewards: updatedRewards, 
            updatedAt: FieldValue.serverTimestamp() 
        });

        // Log the updated rewards
        // console.log(`Updated rewards for donor ${donorId}: ${updatedRewards}`);
        
        res.json({ success: true, id: donationRef.id });
    } catch (error) {
        // Log the error details for debugging
        console.error("Error while adding donation:", error);
        res.status(500).json({ error: 'Failed to add donation', details: error.message });
    }
};


// Get donor details (used for modal)
const getDonorDetails = async (req, res) => {
    try {
        const donorId = req.params.id;
        const donorDoc = await db.collection('donors').doc(donorId).get();

        if (!donorDoc.exists) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        // Fetch the user's details from the "users" collection
        const userSnapshot = await db.collection('users').doc(donorId).get();

        let userDetails = {};
        if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            userDetails = {
                fullName: userData.fullName || "Unknown", // Default to null if not available
                email: userData.email || "Unknown" // Default to null if not available
            };
        } else {
            console.warn(`User not found for donorId: ${donorId}`);
            userDetails = { fullName: "Unknown", email: "Unknown" }; // Or handle as needed
        }

        // Combine donor data with user details
        const donorData = {
            id: donorDoc.id,
            ...donorDoc.data(),
            ...userDetails
        };

        res.json(donorData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donor details' });
    }
};



// List all appointments
// const listAppointments = async (req, res) => {
//     try {
//         const appointmentsSnapshot = await db.collection('appointments').get();

//         // Check if there are any documents in the collection
//         if (appointmentsSnapshot.empty) {
//             console.log('No appointments found in the database.');
//             return res.status(404).json({ error: 'Appointment not found' });
//         }

//         const appointments = [];

//         // Fetching all appointments
//         for (const doc of appointmentsSnapshot.docs) {
//             const appointmentData = doc.data();
//             const donorId = appointmentData.donorId;
//             const centerId = appointmentData.centerId; 

//             // Fetch donor details
//             const donorDoc = await db.collection('users').doc(donorId).get();
//             const donorName = donorDoc.exists ? donorDoc.data().fullName : 'Unknown Donor';
//             const donorEmail = donorDoc.exists ? donorDoc.data().email : 'Unknown Email';

//             // Fetch center details
//             const centerDoc = await db.collection('donationCenters').doc(centerId).get();
//             const donationCenter = centerDoc.exists ? centerDoc.data().name : 'Unknown Center';

//             // Add appointment data to array
//             appointments.push({
//                 id: doc.id,
//                 ...appointmentData,
//                 donorName,
//                 donorEmail,
//                 donationCenter,
//             });
//         }

//         res.json(appointments);
//     } catch (error) {
//         console.error('Error fetching appointments:', error); 
//         res.status(500).json({ error: 'Failed to fetch appointments' });
//     }
// };
const listAppointments = async (req, res) => {
    try {
        const appointmentsSnapshot = await db.collection('appointments').get();

        // Check if there are any documents in the collection
        if (appointmentsSnapshot.empty) {
            console.log('No appointments found in the database.');
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const appointments = [];

        // Fetching all appointments
        const appointmentPromises = appointmentsSnapshot.docs.map(async (doc) => {
            const appointmentData = doc.data();
            const donorId = appointmentData.donorId;
            const centerId = appointmentData.centerId;

            // Log IDs for debugging
            console.log('Processing appointment:', doc.id);
            console.log('Donor ID:', donorId, 'Center ID:', centerId);

            // Ensure donorId and centerId are valid
            if (!donorId || !centerId) {
                console.warn(`Missing donorId or centerId for appointment: ${doc.id}`);
                return {
                    id: doc.id,
                    ...appointmentData,
                    donorName: 'Unknown Donor',
                    donorEmail: 'Unknown Email',
                    donationCenter: 'Unknown Center',
                };
            }

            // Prepare promises for donor and center details
            const donorPromise = db.collection('users').doc(donorId).get();
            const centerPromise = db.collection('donationCenters').doc(centerId).get();

            try {
                // Wait for both promises to resolve
                const [donorDoc, centerDoc] = await Promise.all([donorPromise, centerPromise]);

                const donorName = donorDoc.exists ? donorDoc.data().fullName : 'Unknown Donor';
                const donorEmail = donorDoc.exists ? donorDoc.data().email : 'Unknown Email';
                const donationCenter = centerDoc.exists ? centerDoc.data().name : 'Unknown Center';

                // Add appointment data to array
                return {
                    id: doc.id,
                    ...appointmentData,
                    donorName,
                    donorEmail,
                    donationCenter,
                };
            } catch (err) {
                console.error(`Error fetching donor or center for appointment ${doc.id}:`, err);
                return {
                    id: doc.id,
                    ...appointmentData,
                    donorName: 'Error fetching donor',
                    donorEmail: 'Error fetching email',
                    donationCenter: 'Error fetching center',
                };
            }
        });

        // Wait for all appointments to be processed
        appointments.push(...await Promise.all(appointmentPromises));

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error); 
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};



// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { status } = req.body;

        const appointmentRef = db.collection('appointments').doc(appointmentId);
        await appointmentRef.update({
            status,
            updatedAt: FieldValue.serverTimestamp() // Make sure to use admin for accessing FieldValue
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment status' });
    }
};

// Export the controller methods (add these methods)
module.exports = {
    listDonations,
    addDonation,
    getDonorDetails,
    listAppointments, // Add this line
    updateAppointmentStatus // Add this line
};

