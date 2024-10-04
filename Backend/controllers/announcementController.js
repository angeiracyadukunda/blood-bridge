const { createAnnouncement } = require('../controllers/announcementController'); // Adjust the path as needed
const {db} = require("../firebase/firebaseAdmin");
const { v4: uuidv4 } = require('uuid');

const postAnnouncement = async (req, res) => {
    try {
        const {} = req.body;
        const announcementId = uuidv4(); // Generate new document ID
        const announcement = createAnnouncement(announcementId, announcementData);
        
        await db.collection('announcements').doc(announcementId).set(announcement);
        res.redirect('/api/announcements'); // Redirect to the announcements list page
    } catch (error) {
        console.error("Error posting announcement:", error);
        res.status(500).send("Error posting announcement");
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;
        await db.collection('announcements').doc(announcementId).delete();
        res.redirect('/api/announcements'); // Redirect to the announcements list page
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).send("Error deleting announcement");
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const snapshot = await db.collection('announcements').get();
        const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.render('announcements', { announcements }); // Render your announcement page
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).send("Error fetching announcements");
    }
};

module.exports = { postAnnouncement, deleteAnnouncement, getAnnouncements };
