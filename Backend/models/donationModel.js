const { serverTimestamp } = require('firebase/firestore');

const createDonation = (uid, donationData) => {
    return {
        donationId: uid,
        ...donationData,
        createdAt: serverTimestamp(),
    };
};

module.exports = {createDonation};