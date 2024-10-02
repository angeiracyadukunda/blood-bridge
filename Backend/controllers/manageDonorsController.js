const { db } = require('../firebase/firebaseAdmin'); 

// Fetch donors data and blood donation records
const getDonors = async (req, res) => {
    try {
        const bloodDonationSnapshot = await db.collection('bloodDonation').get();
        const donorsData = [];

        for (const doc of bloodDonationSnapshot.docs) {
            const donation = doc.data();

            // Fetch donor details from 'donors' collection
            const donorDoc = await db.collection('donors').doc(donation.donorId).get();
            const donor = donorDoc.data();

            // Fetch user details from 'users' collection using donor uid
            const userDoc = await db.collection('users').doc(donor.uid).get();
            const user = userDoc.data();

            // Push the combined data to the donorsData array
            donorsData.push({
                fullName: user.fullName,
                email: user.email,
                dateOfDonation: donation.date,
                bloodQuantity: donation.quantity,
                donorId: donor.uid,
            });
        }

        // Render the 'manage-donors' EJS template, passing the donor data
        res.render('manage-donors', { title: 'Manage Donors', donors: donorsData });
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).send('Error fetching donors');
    }
};

// Fetch specific donor details
const getDonorDetails = async (req, res) => {
    try {
        const donorId = req.params.uid;

        // Fetch donor details from 'donors' collection
        const donorDoc = await db.collection('donors').doc(donorId).get();
        const donor = donorDoc.data();

        // Fetch user details from 'users' collection using donor uid
        const userDoc = await db.collection('users').doc(donor.uid).get();
        const user = userDoc.data();

        // Send back the combined donor and user data as JSON
        res.json({
            fullName: user.fullName,
            email: user.email,
            gender: donor.gender,
            dob: donor.dob,
            idType: donor.idType,
            idNo: donor.idNo,
            weight: donor.weight,
            bloodGroup: donor.bloodGroup,
            province: donor.province,
            district: donor.district,
            sector: donor.sector,
            rewards: donor.rewards,
            bio: donor.bio,
        });
    } catch (error) {
        console.error('Error fetching donor details:', error);
        res.status(500).json({ message: 'Error fetching donor details' });
    }
};

module.exports = {
    getDonors,
    getDonorDetails,
};
