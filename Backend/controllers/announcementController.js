const { FieldValue } = require('firebase-admin/firestore');
const {db} = require('../firebase/firebaseAdmin'); // Adjust the path to your Firestore instance
const {createNewAnnouncement } = require("../models/announcementModel");
const { v4: uuidv4 } = require('uuid');

// Create a new announcement
const createAnnouncement = async (req, res) => {
    try {
        // Log the incoming request data
        // console.log('Request Body:', req.body);

        const { announcementTitle, announcementBody, announcementDate, announcementType, announcementLocation } = req.body;
        
        // Check if required fields are available
        if (!announcementTitle || !announcementBody || !announcementDate || !announcementType) {
            // console.log('Missing required fields');
            throw new Error('Missing required fields');
        }

        // Log fields being used to create the announcement
        // console.log('Announcement Data:', {
        //     announcementTitle,
        //     announcementBody,
        //     announcementDate,
        //     announcementType,
        //     announcementLocation,
        // });

        const announcementId = uuidv4(); // Generate a unique ID
        // console.log('Generated Announcement ID:', announcementId);

        // Create the new announcement object
        const newAnnouncement = createNewAnnouncement(announcementId, {
            announcementBody,
            announcementDate,
            announcementLocation,
            announcementTitle,
            announcementType,
        });

        // Log the new announcement before saving it
        // console.log('New Announcement Object:', newAnnouncement);

        // Save the announcement to Firestore
        const docRef = await db.collection('announcements').doc(announcementId).set(newAnnouncement);

        // Log the successful write operation
        // console.log('Announcement successfully saved:', docRef);

        res.status(201).json({ announcementId, ...newAnnouncement });
    } catch (error) {
        // Log the error for debugging
        // console.log('Error in createAnnouncement:', error.message);
        res.status(500).json({ error: error.message });
    }
};


// Get all announcements
const getAnnouncements = async (req, res) => {
    try {
        const snapshot = await db.collection('announcements').get();
        const announcements = [];
        snapshot.forEach(doc => {
            announcements.push({ announcementId: doc.id, ...doc.data() });
        });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing announcement
const updateAnnouncement = async (req, res) => {
    const { id } = req.params;
    const { announcementTitle, announcementBody, announcementDate, announcementType, announcementLocation, status } = req.body;
    try {
        const docRef = db.collection('announcements').doc(id);
        const doc = await docRef.get();

        // Check if the document exists
        if (!doc.exists) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        await docRef.update({
            announcementTitle, 
            announcementBody, 
            announcementDate, 
            announcementType, 
            announcementLocation, 
            status,
            updatedAt: FieldValue.serverTimestamp(),
        });
        res.status(200).json({ message: 'Announcement updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('announcements').doc(id).delete();
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
};
