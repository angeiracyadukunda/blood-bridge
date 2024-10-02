const { FieldValue } = require('firebase-admin/firestore'); 

// models/donationCentersModel.js
const createDonationCenter = (uid, { name, province, district, sector, contact }) => {
    return {
        id: uid,
        name,
        province,
        district,
        sector,
        contact,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };
};

module.exports = { createDonationCenter };
