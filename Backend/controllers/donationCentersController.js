const {db} = require('../firebase/firebaseAdmin'); // Import Firestore instance from the Firebase Admin SDK
const { FieldValue } = require('firebase-admin/firestore');
const {createDonationCenter} = require("../models/donationCentersModel");
const { v4: uuidv4 } = require('uuid'); 
// Fetch donation centers
const getDonationCenters = async (req, res) => {
    try {
        const centersSnapshot = await db.collection('donationCenters').get();
        const centers = centersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(centers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation centers', error });
    }
};

// Create a new donation center
const addDonationCenter = async (req, res) => {
    try {
        const { name, province, district, sector, contact } = req.body;

        // Generate a unique UID for the donation center
        const donationCenterId = uuidv4(); 

        // Use the model function to create the donation center object
        const donationCenter = createDonationCenter(donationCenterId, { name, province, district, sector, contact });

        // Add the donation center to Firestore using the donationCenterId as the document ID
        await db.collection('donationCenters').doc(donationCenterId).set(donationCenter); // Use the generated UID as the document ID

        console.log('Donation center created with ID:', donationCenterId); // Debugging: Log the newly created doc ID

        // Return success response with the donation center ID
        res.status(201).json({ message: 'Donation center created successfully', id: donationCenterId });
    } catch (error) {
        console.error('Error creating donation center:', error); // Log the error
        res.status(500).json({ message: 'Error creating donation center', error });
    }
};

// Update a donation center
const updateDonationCenter = async (req, res) => {
    try {
        const centerId = req.params.id;

        // Include updatedAt in the update object
        const updateData = {
            ...req.body, // Spread the existing fields from the request body
            updatedAt: FieldValue.serverTimestamp(), // Set updatedAt to current timestamp
        };

        await db.collection('donationCenters').doc(centerId).update(updateData);
        res.json({ message: 'Donation center updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating donation center', error });
    }
};

// Get single donation center details for editing
const getDonationCenter = async (req, res) => {
    try {
        const centerId = req.params.id;
        const centerDoc = await db.collection('donationCenters').doc(centerId).get();
        if (!centerDoc.exists) {
            return res.status(404).json({ message: 'Donation center not found' });
        }
        res.json({ id: centerDoc.id, ...centerDoc.data() });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation center', error });
    }
};

module.exports = {
    getDonationCenters,
    addDonationCenter,
    updateDonationCenter,
    getDonationCenter,
};
