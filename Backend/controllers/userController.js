// const User = require('../models/User'); // assuming User model is in models folder
const { sendVerificationEmail } = require('../services/sendEmailService');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInWithCustomToken } = require('firebase/auth');
const fbConfig = '../firebase/firebaseConfig';
const { authentication, db } = require(fbConfig);
const { setDoc, doc, getDoc, serverTimestamp } = require('firebase/firestore');
const uModel = '../models/user';
const { createUserData } = require(uModel);

const { auth, db:dbAdmin } = require('../firebase/firebaseAdmin');


const signupUser = async (req, res) => {
    const { email, fullName, password, role } = req.body;

    try {
         // Create user in Firebase
         const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
         
         const uid = userCredential.user.uid;
         console.log(`User created: ${uid}`);
         // Log to check if Firebase authentication worked
         
 
         // Prepare user data to store in Firestore
         const userData = createUserData(uid, { email, fullName, password, role });
         const userRef = doc(db, 'users', uid);
         
         // Store user data in Firestore
         await setDoc(userRef, userData);
 
         // Log to check if Firestore storage worked
         console.log(`User data stored in Firestore for UID: ${uid}`);
 
         // Send verification email
         const verificationLink = `http://localhost:3000/api/verify-email?uid=${uid}`;
         try {
            await sendVerificationEmail(email,fullName, verificationLink);
            console.log('Verification email sent');
         } catch (error) {
            console.log(error+ "cannot send the email");
         }
         
         // Set session and respond
         req.session.userSignedUp = true;
         res.status(201).json({ message: 'Signup successful. Please verify your email.' });
 
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            res.status(400).json({ message: 'Email already exists. Please log in or sign up using another email.' });
        } else {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
};

const signupSuccess = (req, res) => {
    // Ensure this page is only accessible after signup
    if (!req.session.userSignedUp) {
        return res.redirect('/signup1');
    }
    // Render the signup-success.ejs template
    res.render('signup-success');
};

const verifyEmailLink = async (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).send('Invalid verification link.');
    }

    try {
        // Fetch user by UID from Firebase Auth
        const user = await auth.getUser(uid);

        // Check if the user's email is already verified
        const userRef = dbAdmin.collection('users').doc(uid);
        const userDoc = await userRef.get();
        console.log("User doc: "+userDoc)
        if (userDoc.exists && userDoc.data().emailVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        // Mark user as verified in Firestore
        await userRef.update({ emailVerified: true, updatedAt: serverTimestamp() });

        res.redirect('/login'); // Redirect user to login after verification
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Error verifying email: ' + error.message);
    }
};

module.exports = { signupUser, signupSuccess, verifyEmailLink };