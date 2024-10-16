const { createNotification } = require('../models/createNotificationModel'); 
const { db } = require('../firebase/firebaseAdmin');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../services/sendEmailService');

// Fetch verified donors
const fetchVerifiedDonors = async (req, res) => {
    try {
        const donorsSnapshot = await db.collection('users')
            .where('emailVerified', '==', true)
            .where('role', '==', 'donor')
            .get();

        const donors = [];
        donorsSnapshot.forEach(donorDoc => {
            const donor = donorDoc.data();
            donors.push({
                fullName: donor.fullName,
                email: donor.email,
                role: donor.role,
                id: donor.userId
            });
        });

        res.status(200).json(donors);
    } catch (error) {
        console.error('Error fetching verified donors:', error);
        res.status(500).json({ message: 'Error fetching donors' });
    }
};

// Send notifications to selected users
const sendNotificationToUsers = async (req, res) => {
    const { subject, message, users } = req.body;

    try {
        const notificationId = uuidv4();

        // Save the notification details to Firestore
        const notification = createNotification(notificationId, { subject, message });
        await db.collection('notifications').doc(notificationId).set(notification);

        // Send email notifications
        const emailPromises = users.map(user => {
            const emailMessage = {
                subject,
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <h2 style="color: #4A90E2;">Notification</h2>
                    <p><strong>Dear ${user.fullName},</strong></p>
                    <p>${message}</p>
                    <p>With Regards, </p>
                    <p>Rwanda Blood-Bridge </p>
                </div>
                `
            };
            return sendEmail(user.email, emailMessage);
        });

        await Promise.all(emailPromises);

        res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ message: 'Error sending notifications' });
    }
};

module.exports = { fetchVerifiedDonors, sendNotificationToUsers };
