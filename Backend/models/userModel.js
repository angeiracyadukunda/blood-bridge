const { serverTimestamp } = require('firebase/firestore');

const createUserData = (uid, userData) => {
    return {
        userId: uid,
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        idType: userData.idType, // Include ID type
        idNumber: userData.idNumber, // Include ID number
        rewards: userData.rewards || '0',
        bloodType: userData.bloodType || 'no info',
        preferredLocation: userData.preferredLocation,
        dateOfBirth: userData.dateOfBirth,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
};

module.exports = { createUserData };
