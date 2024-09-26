const fbConfig = '../firebase/firebaseConfig';
const { auth, db } = require(fbConfig);
const { createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
const { setDoc, doc } = require('firebase/firestore');
const uModel = '../models/userModel';
const { createUserData } = require(uModel);

// Signup controller
const signupUser = async (req, res) => {
    const { email, password, role, fullName, phoneNumber, idType, idNumber, rewards, bloodType, preferredLocation, dateOfBirth } = req.body;

    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // Send email verification
        await sendEmailVerification(userCredential.user);

        // Create user document in Firestore
        const userRef = doc(db, 'users', uid);
        const userData = createUserData(uid, {
            email,
            role,
            fullName,
            phoneNumber,
            idType,
            idNumber,
            rewards,
            bloodType,
            preferredLocation,
            dateOfBirth
        });
        
        await setDoc(userRef, userData);
        res.status(201).json({ message: 'User created successfully, check your email for verification.' });
        //redirect to signup-success
        
        setTimeout(() => {
            res.redirect('/signup-success');; // Redirect to signup-success after 3 seconds
        }, 3000);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            res.status(400).json({ message: 'Email already exists. Please log in or sign up using another email.' });
        } else {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
};

module.exports = { signupUser };
