// firebase/firebaseConfig.js

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyDhTuOzrMd5xkdZDnijUzYuPXzMY0vIGho",
    authDomain: "blood-bridge-b30c8.firebaseapp.com",
    databaseURL: "https://blood-bridge-b30c8-default-rtdb.firebaseio.com",
    projectId: "blood-bridge-b30c8",
    storageBucket: "blood-bridge-b30c8.appspot.com",
    messagingSenderId: "586690052414",
    appId: "1:586690052414:web:6a9c10ce2096be92302c6f",
    measurementId: "G-C855XZGG94"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const liveDatabase = getDatabase(firebaseApp);

//export auth and database
module.exports = { auth, liveDatabase, db };

