
require('dotenv').config(); 
const admin = require('firebase-admin');
const serviceAccount = require('./secret/blood-bridge-b30c8-firebase-adminsdk-jfofu-ea99deb941.json'); // Update the path to your .json file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Make sure this is set in your environment variables
});

const db = admin.firestore();
const auth = admin.auth();
module.exports = { db, auth };
