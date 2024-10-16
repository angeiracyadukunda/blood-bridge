const { createSchedules } = require('../models/scheduleModel'); // Adjust the path as needed
const { db } = require('../firebase/firebaseAdmin'); // Adjust the path accordingly
const { v4: uuidv4 } = require('uuid'); 
const { sendEmail } = require('../services/sendEmailService');
// Fetch all schedules
const getSchedules = async (req, res) => {
    try {

        // Fetch schedules from the Firestore database
        const schedulesSnapshot = await db.collection('schedules').get();
        const schedules = schedulesSnapshot.docs.map(doc => ({ scheduleId: doc.id, ...doc.data() }));

        // Send the schedules as a response
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
};

// Add a new schedule
const addSchedule = async (req, res) => {
    try {
        const { date, timeRange } = req.body;
        const data = { date, timeRange };

        // Generate a unique scheduleId
        const scheduleId = uuidv4();

        // Create the schedule object
        const schedule = createSchedules(scheduleId, data);

        // Save the schedule to Firestore using scheduleId as the document ID
        await db.collection('schedules').doc(scheduleId).set(schedule); 

        // Fetch all verified donors from 'users' collection
        const donorsSnapshot = await db.collection('users')
            .where('emailVerified', '==', true)
            .where('role', '==', 'donor')
            .get();

        // Check if donors exist
        if (donorsSnapshot.empty) {
            return res.status(404).json({ message: 'No verified donors found' });
        }

        // Fetch donation centers
        const donationCentersSnapshot = await db.collection('donationCenters').get();

        // Check if donation centers exist
        if (donationCentersSnapshot.empty) {
            return res.status(404).json({ message: 'No donation centers found' });
        }

        // Create an HTML table for donation centers
        let centersTable = `<table style="border-collapse: collapse; width: 100%;">
                                <thead>
                                    <tr>
                                        <th style="border: 1px solid black; padding: 8px;">Name</th>
                                        <th style="border: 1px solid black; padding: 8px;">Province</th>
                                        <th style="border: 1px solid black; padding: 8px;">District</th>
                                        <th style="border: 1px solid black; padding: 8px;">Sector</th>
                                        <th style="border: 1px solid black; padding: 8px;">Contact</th>
                                    </tr>
                                </thead>
                                <tbody>`;
        
        donationCentersSnapshot.forEach(centerDoc => {
            const center = centerDoc.data();
            centersTable += `<tr>
                                <td style="border: 1px solid black; padding: 8px;">${center.name}</td>
                                <td style="border: 1px solid black; padding: 8px;">${center.province}</td>
                                <td style="border: 1px solid black; padding: 8px;">${center.district}</td>
                                <td style="border: 1px solid black; padding: 8px;">${center.sector}</td>
                                <td style="border: 1px solid black; padding: 8px;">${center.contact}</td>
                             </tr>`;
        });
        
        centersTable += `</tbody></table>`;

        // Send personalized emails to each verified donor
        const emailPromises = [];
        donorsSnapshot.forEach(donorDoc => {
            const donor = donorDoc.data();
            const message = {
                subject: 'New Blood Donation Drive',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                        <h2 style="color: #4A90E2;">Blood Donation Drive</h2>
                        <p>Dear ${donor.fullName},</p>
                       <p>We are pleased to announce a new blood donation drive on <strong>${date}</strong>.</p>
                       <p>Here are the donation centers where you can donate:</p>
                       ${centersTable}
                       <p>Thank you for your continued support!</p>
                       <p>Rwanda Blood Bridge</p>
                    </div>`
            };

            // Send email to each donor using their email and personalized name
            emailPromises.push(sendEmail(donor.email, message));
        });

        // Await all email sending processes
        await Promise.all(emailPromises);

        res.status(201).json({ message: 'Schedule created and emails sent successfully', scheduleId });
    } catch (error) {
        console.error('Error creating schedule or sending emails:', error);
        res.status(500).json({ message: 'Error creating schedule or sending emails', error });
    }
}

// Delete a schedule
const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        // Delete the schedule by its ID
        await db.collection('schedules').doc(scheduleId).delete();

        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error });
    }
};

const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { date, timeRange } = req.body;

    try {
        const scheduleRef = db.collection('schedules').doc(id); // Get the document reference for the schedule
        const scheduleDoc = await scheduleRef.get();

        if (!scheduleDoc.exists) {
            return res.status(404).json({ message: 'Schedule not found' }); // If the schedule doesn't exist, return 404
        }

        // Update the schedule
        await scheduleRef.update({
            date,
            timeRange,
            updatedAt: new Date(), // Optionally add a field for the update time
        });

        res.json({ message: 'Schedule updated successfully', scheduleId: id }); // Return a success message
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
};

module.exports = {
    getSchedules,
    addSchedule,
    deleteSchedule,
    updateSchedule
};
