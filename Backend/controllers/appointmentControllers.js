const admin = require('firebase-admin');
const firebase = require('firebase'); 




const db = firebase.firestore(); // Firestore reference

// Function to verify Firebase user token
const verifyToken = async (req) => {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer TOKEN'
  if (!token) throw new Error('Unauthorized');
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken;
};

// Schedule Appointment Controller
const scheduleAppointment = async (req, res) => {
  try {
    // Verify the Firebase Token
    const decodedToken = await verifyToken(req);
    const { uid } = decodedToken; // Get user's Firebase UID

    const {
      name, email, identity, phone, dob, location, date, time, bloodType, notes
    } = req.body;

    // Validate required fields
    if (!name || !email || !identity || !phone || !dob || !location || !date || !time || !bloodType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new appointment document in Firestore
    const appointmentRef = await db.collection('appointments').add({
      donorId: uid,
      name: name,
      email: email,
      identity: parseInt(identity),
      phone: phone,
      dob: new Date(dob),
      location: location,
      preferredDate: new Date(date),
      preferredTime: time,
      bloodType: bloodType,
      notes: notes,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Appointment scheduled successfully!', appointmentId: appointmentRef.id });

  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({ message: 'Server error. Could not schedule appointment.' });
  }
};

module.exports = { scheduleAppointment };
