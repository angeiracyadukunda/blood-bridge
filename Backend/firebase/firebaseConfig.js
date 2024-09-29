// firebase/firebaseConfig.js

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getDatabase } = require("firebase/database");
require('dotenv').config(); 

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
// const firebaseConfig = {
//     apiKey: "AIzaSyDhTuOzrMd5xkdZDnijUzYuPXzMY0vIGho",
//     authDomain: "blood-bridge-b30c8.firebaseapp.com",
//     databaseURL: "https://blood-bridge-b30c8-default-rtdb.firebaseio.com",
//     projectId: "blood-bridge-b30c8",
//     storageBucket: "blood-bridge-b30c8.appspot.com",
//     messagingSenderId: "586690052414",
//     appId: "1:586690052414:web:6a9c10ce2096be92302c6f",
//     measurementId: "G-C855XZGG94"
// };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const authentication = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const liveDatabase = getDatabase(firebaseApp);

//export auth and database
module.exports = { authentication, liveDatabase, db };

