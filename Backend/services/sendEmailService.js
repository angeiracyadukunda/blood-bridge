// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create the transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Email user from the .env file
    pass: process.env.EMAIL_PASSWORD  // Email password from the .env file
  },
});

// Function to send verification email
const sendVerificationEmail = async (email,name, verificationLink) => {
  const mailOptions = {
    from: 'Rwanda Blood Bridge <rwandabloodbridge@gmail.com>', // sender address
    to: email, // recipient email
    subject: 'Email Verification', // Subject line
    html: `<p>Dear ${name},</p> <p>Thank you for signing up at <b>Rwanda Blood Bridge</b></p><p>Click <a href="${verificationLink}">here</a> to verify your email account.</p>`, // HTML body
  };

  // Send email
  await transporter.sendMail(mailOptions);
  console.log(`Verification email sent to ${email}`);
};

module.exports = { sendVerificationEmail };
