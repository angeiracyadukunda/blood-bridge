const { FieldValue } = require('firebase-admin/firestore');

const createNotification = (notificationId, { subject, message }) => {
    return {
        notificationId,
        subject,
        message,
        createdAt: FieldValue.serverTimestamp(),
    };
};

module.exports = { createNotification };
