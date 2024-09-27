const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fbConfig = './Backend/firebase/firebaseConfig';
const {auth, liveDatabase, db } = require(fbConfig); // Import the database instance
const { ref, push, set } = require('firebase/database');

// const signupRoutes = require('./Backend/routes/signupRoute');
const authRoutes = require('./Backend/routes/authRoute'); 
const loginRoutes = require('./Backend/routes/loginRoute');
const session = require('express-session');

// Express app
const app = express();


app.listen(3000,()=>{
    console.log("listening to port 3000")
    });
// Register view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from public folder

app.use(session({
    secret: '2010373b2911c799435ed43923849612c007ba1d4495e7925133a9114d27d9b3', // Use a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 180 * 24 * 60 * 60 * 1000
     } // Set to true if using HTTPS in production
}));

// Routes
app.use('/api', authRoutes);
app.use('/api', loginRoutes);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
// Listen for requests


app.use((req, res, next) => {
    console.log("new request was made:");
    console.log("host: ", req.hostname);
    console.log("path: ", req.path);
    console.log("method: ", req.method);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('aboutblood', { title: 'About Blood' });
});
app.get('/aboutblood', (req, res) => {
    res.redirect("./about")
});
app.get('/appointment', (req, res) => {
    res.render('appointment', { title: 'Appointments' });
});
app.get('/beforeafter', (req, res) => {
    res.render('beforeafter', { title: 'Before and After Blood donation' });
});
app.get('/benefits', (req, res) => {
    res.render('benefits', { title: 'Rewards' });
});
app.get('/blooddonation', (req, res) => {
    res.render('blooddonation', { title: 'Blood Donatoin' });
});
app.get('/concerns', (req, res) => {
    res.render('concerns', { title: 'Common Concerns About Blood Donation' });
});
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

// Admin Dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard/maindashboard', { title: "Admin Dashboard"});
});
app.get('/dashboard/profile', (req, res) => {
    res.render('dashboard/profile', { title: 'Profile Settings' });
});
app.get('/dashboard/dashboard-overview', (req, res) => {
    res.render('dashboard/dashboard-overview', { title: 'Dashboard Overview' });
});

app.get('/dashboard/manage-appointments', (req, res) => {
    res.render('dashboard/manage-appointments', { title: 'Manage Appointments' });
});
app.get('/dashboard/manage-donors', (req, res) => {
    res.render('dashboard/manage-donors', { title: 'Manage Donors' });
});
app.get('/dashboard/post-announcements', (req, res) => {
    res.render('dashboard/post-announcements', { title: 'Post Announcements' });
});

// Donor Dashoard

app.get('/donorsdashboard/overview', (req, res) => {
    res.render('donorsdashboard/overview', { title: 'Dashboard Overview' });
});

app.get('/donorsdashboard', (req, res) => {
    res.render('donorsdashboard/donor', { title: 'Dashboard' });
});

app.get('/donorsdashboard/appointments', (req, res) => {
    res.render('donorsdashboard/appointments', { title: 'All Appointments' });
});

app.get('/donorsdashboard/donor-card', (req, res) => {
    res.render('donorsdashboard/donor-card', { title: 'View My Donor Card' });
});

app.get('/donorsdashboard/drives', (req, res) => {
    res.render('donorsdashboard/drives', { title: 'Dashboard' });
});

app.get('/donorsdashboard/guidelines', (req, res) => {
    res.render('donorsdashboard/guidelines', { title: 'Dashboard' });
});

app.get('/donorsdashboard/health-screening', (req, res) => {
    res.render('donorsdashboard/health-screening', { title: 'Dashboard' });
});

app.get('/donorsdashboard/when-to-donate', (req, res) => {
    res.render('donorsdashboard/when-to-donate', { title: 'Dashboard' });
});



// User Dashboard
app.get('/:username/dashboard', (req, res) => {
    const username = req.params.username; // Extract the username from the URL
    res.render('dashboard', { title: 'Dashboard', username });
});
app.get('/:username/donatehistory', (req, res) => {
    const username = req.params.username; // Extract the username from the URL
    res.render('donatehistory', { title: 'Donation History', username });
});
app.get('/:username/donationpro', (req, res) => {
    const username = req.params.username; // Extract the username from the URL
    res.render('donationpro', { title: 'Donation Pro', username });
});
app.get('/donationpro', (req, res) => {
    res.render('donationpro', { title: 'Donation Process' });
});
app.get('/eligibility', (req, res) => {
    res.render('eligibility', { title: 'Eligibility Requirements' });
});
app.get('/firsttimedoner', (req, res) => {
    res.render('firsttimedoner', { title: 'First-Time Blood Donors' });
});
app.get('/forgotpass', (req, res) => {
    res.render('forgotpass', { title: 'Forgot Password' });
});
app.get('/helps', (req, res) => {
    res.render('helps', { title: 'Helps' });
});

app.get('/news', (req, res) => {
    res.render('news', { title: 'News and Announcements' });
});
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup Page' });
});
app.get('/whathappens', (req, res) => {
    res.render('whathappens', { title: 'What Happens' });
});
app.get('/whatwedo', (req, res) => {
    res.render('whatwedo', { title: 'What we Do' });
});
app.get('/whoweare', (req, res) => {
    res.render('whoweare', { title: 'Who we are' });
});
// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error: 404' });
});
