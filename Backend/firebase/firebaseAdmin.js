
require('dotenv').config(); 
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

admin.initializeApp({
  
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Make sure this is set in your environment variables
});

const db = admin.firestore();
const auth = admin.auth();
module.exports = { db, auth };
