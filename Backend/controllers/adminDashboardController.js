const { db } = require('../firebase/firebaseAdmin'); // Firebase configuration
const { FieldValue } = require('firebase-admin/firestore');

const getDashboardData = async (req, res) => {
    try {
        const donorsSnapshot = await db.collection('donors').get();
        const donationsSnapshot = await db.collection('donations').get();
        const appointmentsSnapshot = await db.collection('appointments').get();
        const usersSnapshot = await db.collection('users').get();
        const donationCentersSnapshot = await db.collection('donationCenters').get();

        const donors = [];
        const users = {};
        const donations = [];
        const appointments = [];
        const donationCenters = {};

        // Store user data in a map for easy access by uid
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            users[doc.id] = { fullName: userData.fullName, email: userData.email };
        });

        // Store donation center data in a map for easy access
        donationCentersSnapshot.forEach(doc => {
            const centerData = doc.data();
            donationCenters[centerData.id] = { name: centerData.name, province: centerData.province, district: centerData.district, sector: centerData.sector };
        });

        // Process donors and associate them with user information
        donorsSnapshot.forEach(doc => {
            const donorData = doc.data();
            donors.push({
                uid: donorData.uid,
                fullName: users[donorData.uid]?.fullName || 'Unknown Donor',  // Ensure the fullName is populated
                email: users[donorData.uid]?.email || 'Unknown Email',
                bloodGroup: donorData.bloodGroup,
                district: donorData.district,
                dob: donorData.dob,
                gender: donorData.gender,
                idNo: donorData.idNo,
                idType: donorData.idType,
                province: donorData.province,
                rewards: donorData.rewards,
                sector: donorData.sector,
                weight: donorData.weight,
            });
        });

        // Process donations and add donor object and donation center object
        donationsSnapshot.forEach(doc => {
            const donationData = doc.data();
            const donor = donors.find(d => d.uid === donationData.donorId); // Match donor by uid
            const donationCenter = donationCenters[donationData.donationCenter]; // Match donation center by id

            donations.push({
                donationId: doc.id,
                donor: donor || { fullName: 'Unknown Donor', email: 'Unknown Email' },  // Fallback in case donor is not found
                donationDate: donationData.donationDate,
                rhesus: donationData.rhesus,
                signature: donationData.signature,
                donationCenter: donationCenter || { name: 'Unknown Center' }, // Fallback in case center is not found
                firstBloodCheck: donationData.firstBloodCheck,
                secondBloodCheck: donationData.secondBloodCheck,
                doctorName: donationData.doctorName,
                bloodQuantity: donationData.bloodQuantity,
                createdAt: FieldValue.serverTimestamp(),
            });
        });

        // Process appointments and add donor and center objects
        appointmentsSnapshot.forEach(doc => {
            const appointmentData = doc.data();
            const donor = donors.find(d => d.uid === appointmentData.donorId); // Match donor by uid
            const donationCenter = donationCenters[appointmentData.centerId]; // Match donation center by id

            appointments.push({
                appointmentId: doc.id,
                donor: donor || { fullName: 'Unknown Donor', email: 'Unknown Email' },  // Fallback in case donor is not found
                center: donationCenter || { name: 'Unknown Center' }, // Fallback in case center is not found
                scheduleTime: appointmentData.scheduleTime,
                scheduleDate: appointmentData.scheduleDate,
                notes: appointmentData.notes,
                status: appointmentData.status,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        });

        // Respond with processed data
        res.status(200).json({ donors, donations, appointments });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Error fetching dashboard data' });
    }
};


module.exports = { getDashboardData };
