const { createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
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

        // Send email verification
        const actionCodeSettings = {
            url: 'http://localhost:3000/verify?uid=' + uid,
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

    res.send(`
        
        <h1>Your account was created successfully!</h1>
        <p>An activation link was sent to your email address. Please verify your email to continue.</p>
    `);
};

// Email verification handler
const verifyEmail = (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).send('Invalid verification link.');
    }

    res.send(`
        
        <h1>Your account was successfully verified!</h1>
        <p>Redirecting to your dashboard...</p>
      
        <script>
            setTimeout(function() {
                window.location.href = "/dashboard";
            }, 2000);
        </script>
    `);
};

module.exports = { signupUser, signupSuccess, verifyEmail };
