const { db } = require('../firebase/firebaseAdmin');

// Middleware to check if a user is authenticated and has the correct role
const isAuthenticated = (role) => {
    return (req, res, next) => {
        const { uid } = req.params;

        // Check if the user is logged in
        if (req.session.user) {
            // Check if UID and role match the session data
            if (req.session.user.uid === uid && req.session.user.role === role) {
                return next(); // User is authenticated and authorized, proceed
            } else {
                return res.status(403).json({ message: 'Unauthorized access' }); // Role or UID mismatch
            }
        } else {
            return res.redirect('/login'); // Not logged in, redirect to login page
        }
    };
};

// Middleware to fetch dashboard data for both donors and recipients
const dashboardData = (role) => {
    return async (req, res) => {
        const { uid } = req.params;

        // Check if data is already in the session
        if (req.session.dashboardData && req.session.dashboardData[uid] && req.session.dashboardData[uid].role === role) {
            return req.session.dashboardData[uid]; // Return cached data
        }

        try {
            // Fetch the basic user data from the "users" collection
            const userRef = db.collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (userDoc.exists && userDoc.data().role === role) {
                const userData = userDoc.data();

                // Fetch donor or recipient-specific data based on role
                let specificData = {};
                if (role === 'donor') {
                    const donorRef = db.collection('donors').doc(uid);
                    const donorDoc = await donorRef.get();
                    if (donorDoc.exists) {
                        const donorData = donorDoc.data();
                        specificData = {
                            gender: donorData.gender,
                            dob: donorData.dob,
                            idType: donorData.idType,
                            idNo: donorData.idNo,
                            weight: donorData.weight,
                            bloodGroup: donorData.bloodGroup,
                            province: donorData.province,
                            district: donorData.district,
                            sector: donorData.sector,
                            rewards: donorData.rewards,
                            imageLink: donorData.imageLink,
                            bio: donorData.bio,
                            modifiedAt: donorData.modifiedAt
                        };
                    } else {
                        throw new Error('Donor data not found');
                    }
                } else if (role === 'recipient') {
                    const recipientRef = db.collection('recipients').doc(uid);
                    const recipientDoc = await recipientRef.get();
                    if (recipientDoc.exists) {
                        const recipientData = recipientDoc.data();
                        specificData = { bio: recipientData.bio };
                    } else {
                        throw new Error('Recipient data not found');
                    }
                }

                // Merge user data with role-specific data
                const dashboardData = {
                    fullName: userData.fullName,
                    email: userData.email,
                    role: userData.role,
                    uid,
                    ...specificData
                };

                // Store the dashboard data in the session
                req.session.dashboardData = req.session.dashboardData || {};
                req.session.dashboardData[uid] = dashboardData;

                return dashboardData; // Return the fetched data
            } else {
                throw new Error('Unauthorized access or role mismatch');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error; // Rethrow to handle in the route
        }
    };
};

// General controller to render dashboard views
// General controller to render dashboard views
// General controller to render dashboard views
const renderDashboardView = (role, viewName, pageTitle) => {
    return async (req, res) => {
        const { uid } = req.params;

        try {
            const userData = await dashboardData(role)(req, res);
            if (!userData.uid) {
                userData.uid = uid;
            } // Fetch the relevant dashboard data
            // console.log('Fetched User Data:', userData); // Log userData to see its structure
            res.render(viewName, {
                title: pageTitle,
                user: userData,
                //user: JSON.stringify(userData) ? JSON.stringify(userData) : null // Make sure you're passing userData as 'user'
            });
        } catch (error) {
            console.error('Error rendering view:', error); // Log the error
            res.status(404).json({ message: error.message }); // Handle errors gracefully
        }
    };
};


// Redirect based on role in session
const checkAndRedirect = async (req, res) => {
    const { uid } = req.session.user; // Assuming user is stored in session after login

    try {
        const userData = req.session.dashboardData && req.session.dashboardData[uid]
            ? req.session.dashboardData[uid]
            : await dashboardData(req.session.user.role)(req, res); // Fetch if not in session

        if (userData.role === 'donor') {
            return res.redirect(`/${uid}/donorsdashboard`);
        } else if (userData.role === 'recipient') {
            return res.redirect(`/${uid}/recipientsdashboard`);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { dashboardData, isAuthenticated, renderDashboardView, checkAndRedirect };
