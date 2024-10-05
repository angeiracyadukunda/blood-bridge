const { FieldValue } = require('firebase-admin/firestore');

const createNewAnnouncement = (id, announcementData) => {
    return {
        announcementId: id,
        announcementType: announcementData.announcementType,
        announcementTitle: announcementData.announcementTitle,
        announcementBody: announcementData.announcementBody,
        announcementDate: announcementData.announcementDate,
        announcementLocation: announcementData.announcementLocation,
        status: "valid",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };
};

module.exports = {createNewAnnouncement};