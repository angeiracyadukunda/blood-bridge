const { serverTimestamp } = require('firebase/firestore');

const createContact = (uid, contactData) => {
    return {
        contactId: uid,
        ...contactData,
        createdAt: serverTimestamp(),
    };
};

module.exports = {createContact}