const { db } = require('../firebase/firebaseAdmin'); // db instance
const { createMessage } = require('../models/contactFormModel');
const { sendEmailStyled } = require('../services/sendEmailService'); // Your existing email service

// Handle contact form submission
const sendMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Create a unique ID for the message
        const messageId = db.collection('messages').doc().id;

        // Create the message object
        const newMessage = createMessage(messageId, { name, email, subject, message });

        // Store message in db
        await db.collection('messages').doc(messageId).set(newMessage);

        // Prepare the confirmation message for the email
        const emailMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h2 style="color: #4A90E2;">Your Message:</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p>Thank you! We have received your message and will get back to you ASAP.</p>
            </div>
        `;

        // Send confirmation email to the user using your existing sendEmail function
        await sendEmailStyled(email, {
            subject: 'Confirmation of Your Message',
            html: emailMessage, // HTML content
        });

        // Send a response back
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
};

module.exports = { sendMessage };
