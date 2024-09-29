const { serverTimestamp } = require('firebase/firestore');

const createAnnouncement = (uid, announcementData) => {
    return {
        announcementId: uid,
        ...announcementData,
        status: "valid",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
};

module.exports = {createAnnouncement};