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
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
          <h2 style="color: #4A90E2;">Email Verification</h2>
           <p>Dear ${name},</p> <p>Thank you for signing up at <b>Rwanda Blood Bridge</b></p><p>Click <a href="${verificationLink}"> <b>here</b> </a> to verify your email account.</p>
      </div>
    `, // HTML body
  };

  // Send email
  await transporter.sendMail(mailOptions);
  console.log(`Verification email sent to ${email}`);
};
const sendEmail = async (email, message) => {
  const mailOptions = {
    from: 'Rwanda Blood Bridge <rwandabloodbridge@gmail.com>', // sender address
    to: email, // recipient email
    subject: message.subject, // Subject line
    html: message.html, // HTML body
  };

  // Send email
  await transporter.sendMail(mailOptions);
  console.log(`Message sent to ${email}`);
};
const sendEmailStyled = async (email, message) => {
  const mailOptions = {
    from: 'Rwanda Blood Bridge <rwandabloodbridge@gmail.com>', // sender address
    to: email, // recipient email
    subject: message.subject, // Subject line
    html: message.html, // HTML body
  };

  // Send email
  await transporter.sendMail(mailOptions);
  console.log(`Message sent to ${email}`);
};

module.exports = { sendVerificationEmail, sendEmail, sendEmailStyled };
