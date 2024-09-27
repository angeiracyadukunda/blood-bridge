const { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, getAuth, signInWithCustomToken } = require('firebase/auth');
const fbConfig = '../firebase/firebaseConfig';
const { auth, db } = require(fbConfig);
const { setDoc, doc } = require('firebase/firestore');
const uModel = '../models/userModel';
const { createUserData } = require(uModel);

// Signup controller
const signupUser = async (req, res) => {
    const { email, password, role, fullName, phoneNumber, idType, idNumber, preferredLocation, dateOfBirth } = req.body;

    try {
        // Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // await updateProfile(userCredential.user, {
        //     displayName: fullName, // Set the display name
        // });

        // Send email verification
        const actionCodeSettings = {
            url: `http://localhost:3000/verify-email?uid=${uid}`,
            handleCodeInApp: true,
        };

        await sendEmailVerification(userCredential.user, actionCodeSettings);

        // Create user document in Firestore
        const userRef = doc(db, 'users', uid);
        const userData = createUserData(uid, { email, role, fullName, phoneNumber, idType, idNumber, preferredLocation, dateOfBirth });
        await setDoc(userRef, userData);

        // Set session to allow access to the success page
        req.session.userSignedUp = true;

    // Instead of redirecting here, send a success message back to the client
    res.status(201).json({ message: 'User created successfully. Please verify your email.' });
    } catch (error) {
        if (error.code === 'api/email-already-in-use') {
            res.status(400).json({ message: 'Email already exists. Please log in or sign up using another email.' });
        } else {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
};

// Signup success page controller
const signupSuccess = (req, res) => {
    // Ensure this page is only accessible after signup
    if (!req.session.userSignedUp) {
        return res.redirect('/signup');
    }

    // Render the signup-success.ejs template
    res.render('signup-success');
};

// Email verification handler
const verifyEmailLink = async (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).send('Invalid verification link.');
    }

    try {
        const user = await auth.getUser(uid); // Fetch the user by UID
        const customToken = await auth.createCustomToken(uid); // Create a custom token
        await signInWithCustomToken(auth, customToken); // Sign in the user

        req.session.user = uid; // Store UID in session for logged-in status
        res.redirect('/dashboard'); // Redirect to dashboard
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).send('Error verifying email: ' + error.message);
    }
};

module.exports = { signupUser, signupSuccess, verifyEmailLink };
