const {db} = require('../firebase/firebaseAdmin');

const getAnnouncements = async (req, res) => {
    try {
        const announcementsSnapshot = await db.collection('announcements').get();
        
        // Log for debugging
        console.log('Firestore snapshot size:', announcementsSnapshot.size);

        // Ensure there are documents to process
        if (announcementsSnapshot.empty) {
            console.log('No announcements found');
            return res.status(404).json({ message: 'No announcements found' });
        }

        const announcements = announcementsSnapshot.docs.map(doc => {
            console.log('Fetched announcement:', doc.data());
            return doc.data();
        });

        // Categorize announcements based on type
        const latestNews = announcements.filter(a => a.announcementType === 'Latest News');
        const upcomingEvents = announcements.filter(a => a.announcementType === 'Upcoming Events');
        const successStories = announcements.filter(a => a.announcementType === 'Success Stories');
        const eventHighlights = announcements.filter(a => a.announcementType === 'Event Highlights');

        res.status(200).json({ latestNews, upcomingEvents, successStories, eventHighlights });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
};

module.exports = { getAnnouncements };
