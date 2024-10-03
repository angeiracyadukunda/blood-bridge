const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// User Model
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,  // Generates unique userId
        unique: true
      },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['donor', 'recipient', 'admin'],
        default: 'donor'
    },
    fullName: {
        type: String,
        default: 'no info'
    },
    rewards: {
        type: String,
        default: '0',
    },
    phoneNumber: {
        type: String,
        default: 'no info'
    },
    identity: {
        type: String,
        default: 'no info'
    },
    bloodGroup: {
        type: String,
        default: 'no info'
    },
    preferredLocation: {
        type: String,
        default: 'no info'
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
}, { timestamps: true });

// Receiver (Authorized Organization)
const receiverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: 'no info'
    },
    phone: {
        type: String,
        default: 'no info'
    },
    contactPerson: {
        type: String,
        default: 'no info'
    }
}, { timestamps: true });

// Appointment Model
const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Reference to User model
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receiver',
        required: true // Reference to Receiver model
    },
    preferredDate: {
        type: Date,
        required: true
    },
    preferredTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    }
}, { timestamps: true });

// Notification Reminder
const notificationReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['reminder'],
        default: 'reminder'
    },
    status: {
        type: String,
        enum: ['appointment reminder'],
        default: 'appointment reminder'
    },
    reminderDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Blood Donation Card
const bloodDonationCardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    dateOfDonation: {
        type: Date,
        required: true
    },
    timesOfDonation: {
        type: Number,
        default: 0
    },
    rhesus: {
        type: String,
        default: 'no info'
    },
    doctorName: {
        type: String,
        default: 'no info'
    },
    bloodQuantity: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

// Contact Us Model
const contactUsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // In case an anonymous user contacts
    },
    fullNames: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Approval Model
const approvalSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming an admin or authorized user approves
        required: true
    },
    approvalDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['approved', 'denied'],
        required: true
    }
}, { timestamps: true });

// Export Models
const User = mongoose.model('User', userSchema);
const Receiver = mongoose.model('Receiver', receiverSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const NotificationReminder = mongoose.model('NotificationReminder', notificationReminderSchema);
const BloodDonationCard = mongoose.model('BloodDonationCard', bloodDonationCardSchema);
const ContactUs = mongoose.model('ContactUs', contactUsSchema);
const Approval = mongoose.model('Approval', approvalSchema);

module.exports = {
    User,
    Receiver,
    Appointment,
    NotificationReminder,
    BloodDonationCard,
    ContactUs,
    Approval
};
