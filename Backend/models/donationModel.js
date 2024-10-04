const { FieldValue } = require('firebase-admin/firestore');
const provinces = require('rwanda/data/provinces');

const createDonation = (id, donationData) => {
    return {
        donationId: id,
        donorId:donationData.donorId,
        donationDate: donationData.donationDate,
        rhesus: donationData.rhesus,
        signature: donationData.signature,
        donationCenter: donationData.donationCenter,
        firstBloodCheck: donationData.firstBloodCheck,
        secondBloodCheck: donationData.secondBloodCheck,
        doctorName: donationData.doctorName,
        bloodQuantity: donationData.bloodQuantity,
        createdAt: FieldValue.serverTimestamp(),
    };
};

module.exports = {createDonation};