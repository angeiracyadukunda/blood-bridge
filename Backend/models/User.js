const { serverTimestamp } = require('firebase/firestore');

const createUserData = (uid, userData) => {
    return {
        userId: uid,
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
};

module.exports = { createUserData };