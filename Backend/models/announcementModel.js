const { FieldValue } = require('firebase-admin/firestore');

const createAnnouncement = (id, announcementData) => {
    return {
        announcementId: id,
        announcementType: announcementData.announcementType,
        announcementTile: announcementData.announcementTile,
        announcementBody: announcementData.announcementBody,
        announcementDate: announcementData.announcementDate,
        announcementLocation: announcementData.announcementLocation,
        status: "valid",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };
};

module.exports = {createAnnouncement};