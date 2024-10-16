const { createDonorData } = require('../models/donorModel'); 
const fbConfig = '../firebase/firebaseAdmin.js'; // Assuming the donor model is in models folder
const { db } = require(fbConfig);



const { collection, doc, setDoc, query, where, getDocs } = require('firebase-admin/firestore'); // Use Firestore from 'firebase-admin'
// Helper function to get UID by email
// Query Firestore using Admin SDK
const getUserUidByEmail = async (email) => {
    try {
        // Use db.collection() directly to query Firestore
        const userQuery = db.collection('users').where('email', '==', email); // Correct usage in Admin SDK
        const querySnapshot = await userQuery.get(); // Use `.get()` to retrieve documents

        if (querySnapshot.empty) {
            throw new Error('User not found.');
        }

        // Assuming emails are unique, get the first document's UID
        const userDoc = querySnapshot.docs[0];
        const uid = userDoc.id; // The document ID is the UID

        return uid;
    } catch (error) {
        throw new Error('Error retrieving user UID: ' + error.message);
    }
};

// Register function to create donor data
const registerDonor = async (req, res) => {
    const { email, fullName, ...data } = req.body;
    try {
        // Get the user's UID using the email
        const uid = await getUserUidByEmail(email);
        
        // Now that we have the UID, we can create the donor data
        await db.collection('donors').doc(uid).set(createDonorData(uid, data)); // Correct usage in Admin SDK: db.collection().doc()
        const donorData = {
            uid,
            ...data,
        };

        
        //await donorRef.set(createDonorData(uid, data)); // Use .set() directly on the document reference
        //res.render('registration-success', { fullName });
        req.session.registrationComplete = true;
        req.session.registrationTime = Date.now();
        res.status(201).json({ message: `Donor ${fullName} registered successfully.` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const checkRegistrationComplete = (req, res, next) => {
    const now = Date.now();
    const registrationTime = req.session.registrationTime; // Store the registration time
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

    if (req.session.registrationComplete && registrationTime && (now - registrationTime) < tenMinutes) {
        return next(); // Allow access to the page
    }
    // If conditions are not met, reset session and redirect to signup page
    req.session.registrationComplete = false;
    req.session.registrationTime = null; // Clear the timestamp
    return res.redirect('/signup');
};

// Middleware to check if the user is already registered or logged in
const checkAlreadyRegistered = (req, res, next) => {
    if (req.session.userLoggedIn) {
        res.redirect('/login'); // If logged in, redirect to login page
    } else {
        next(); // Continue if not already logged in
    }
};

module.exports = {
    registerDonor,
    checkRegistrationComplete,
    checkAlreadyRegistered,
};
