const { FieldValue } = require('firebase-admin/firestore');

const createDonation = (uid, donationData) => {
    return {
        donationId: uid,
        ...donationData,
        createdAt: FieldValue.serverTimestamp(),
    };
};

module.exports = {createDonation};