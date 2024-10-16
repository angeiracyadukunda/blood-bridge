const { title } = require('process');
const { auth, db } = require('../firebase/firebaseAdmin');
const { sendEmail } = require('../services/sendEmailService'); // Adjust the import according to your file structure
const crypto = require('crypto');

// Function to send reset password link
const sendResetLink = async (req, res) => {
    const { email } = req.body;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return res.status(404).json({ success: false, message: 'Email not found.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const resetLink = `http://${req.headers.host}/api/reset-password?userId=${userRecord.uid}&token=${token}`;

        // Save token to db (You can create a "passwordResets" collection for this)
        await db.collection('passwordResets').doc(userRecord.uid).set({
            token,
            createdAt: new Date(),
        });

        // Send email using the sendEmail function
        const message = {
            from: 'no-reply@yourapp.com', // Change as needed
            subject: 'Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <h2 style="color: #4A90E2;">Link to Reset your password</h2>
                    <p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
                </div>
            `,
        };

        await sendEmail(email, message);

        res.status(200).json({ success: true, message: 'Password reset link sent!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// Function to handle GET request for the reset password page
const getResetPasswordPage = async (req, res) => {
    const { userId, token } = req.query; // Extract userId and token from the query parameters

    try {
        // Fetch the reset token document from db
        const resetDoc = await db.collection('passwordResets').doc(userId).get();

        // Check if the token exists and matches the token in the request
        if (!resetDoc.exists || resetDoc.data().token !== token) {
            return res.redirect('/login'); // Redirect to login if token is invalid or expired
        }

        // Check if the user exists in Firebase Auth
        const userRecord = await auth.getUser(userId);
        if (!userRecord) {
            return res.redirect('/login'); // Redirect if user doesn't exist
        }

        // Render the forgotpassForm.ejs page with userId and token
        res.render('forgotpassForm', { userId, token, title:"Reset Password" });
    } catch (error) {
        console.error('Error:', error.message);
        return res.redirect('/login'); // Redirect to login in case of error
    }
};

// Function to reset the password
const resetPassword = async (req, res) => {
    const { userId, token, newPassword } = req.body;

    try {
        const resetDoc = await db.collection('passwordResets').doc(userId).get();

        if (!resetDoc.exists || resetDoc.data().token !== token) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
        }

        // Verify the user exists in Firebase
        const userRecord = await auth.getUser(userId);
        if (!userRecord) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Reset the password in Firebase
        await auth.updateUser(userId, { password: newPassword });

        // Delete the reset token from db
        await db.collection('passwordResets').doc(userId).delete();

        res.status(200).json({ success: true, message: 'Password successfully reset.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    sendResetLink,
    resetPassword,
    getResetPasswordPage,
};
