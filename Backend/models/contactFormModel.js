const { FieldValue } = require('firebase-admin/firestore');

const createMessage = (messageId, { name, email, subject, message }) => {
    return {
        messageId,
        name,
        email,
        subject,
        message,
        createdAt: FieldValue.serverTimestamp(),
    };
};

module.exports = { createMessage };