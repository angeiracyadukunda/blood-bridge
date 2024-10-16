const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fbConfig = './Backend/firebase/firebaseConfig';
const {authentication, liveDatabase, db } = require(fbConfig); // Import the database instance
const { ref, push, set } = require('firebase/database');
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();
const rwanda = require('rwanda');
const { Provinces, Districts, Sectors } = require('rwanda');
require('dotenv').config(); 

// const signupRoutes = require('./Backend/routes/signupRoute');
const authRoutes = require('./Backend/routes/authRoute'); 
const loginRoutes = require('./Backend/routes/loginRoute');
const signupRoute = require('./Backend/routes/signupRoute');
const dashboardRoutes = require('./Backend/routes/dashboardRoute');
const donationRoute = require('./Backend/routes/manageDonationsRoute');
const session = require('express-session');
const scheduleRoutes = require("./Backend/routes/scheduleRoutes");
const donationCentersRoutes = require("./Backend/routes/donationCentersRoute");
const appointmentRoutes = require('./Backend/routes/appointmentRoute');
const announcementRoutes = require('./Backend/routes/announcementRoute');
const newsRoutes = require('./Backend/routes/newsRoutes');
const adminAppointmentsRoutes = require('./Backend/routes/manageAppointmentsRoute');
const adminDashboardRoutes = require('./Backend/routes/adminDashboardRouter');
const forgetPassRoute = require('./Backend/routes/forgetPassRoutes');
const contactRoutes = require('./Backend/routes/contactRoute');
const notificationRoutes = require('./Backend/routes/notificationRoutes');
// Express app
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Register view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(bodyParser.json());

app.use(express.static('public'));  // Serve static files from public folder

app.use(session({
    secret: process.env.SESSION_KEY, // Use a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        maxAge: 180 * 24 * 60 * 60 * 1000
     } // Set to true if using HTTPS in production
}));

// Routes
app.use('/api', loginRoutes);
app.use('/api', signupRoute);
app.use('/', dashboardRoutes);
app.use('/api', donationCentersRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', newsRoutes);
app.use('/api/donations', donationRoute);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admin/appointments', adminAppointmentsRoutes);
app.use('/api', adminDashboardRoutes);
app.use('/api', forgetPassRoute);
app.use('/api', contactRoutes);
app.use('/api', notificationRoutes);


app.use('/api', scheduleRoutes);
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

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/register', (req, res) => {
    const { email, fullName } = req.query;
    res.render('register', { 
        title: 'Register', 
        email, 
        fullName 
    });
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
    res.render('benefits', { title: 'Benefits' });
});
app.get('/rewards', (req, res) => {
    res.render('rewards', { title: 'Rewards' });
});
app.get('/blooddonation', (req, res) => {
    res.render('blooddonation', { title: 'Blood Donatoin' });
});
app.get('/concerns', (req, res) => {
    res.render('concerns', { title: 'Common Concerns About Blood Donation' });
});
app.get('/contact', (req, res) => {
    res.render('contact', { title: '' });
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
    res.render('login', { title: '' });
});
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup Page' });
});

app.get('/signup1', (req, res) => {
    res.render('signup1', { title: 'Signup1 Page' });
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


// Donor Registration Route
app.get('/donorRegister', (req, res) => {
    try {
        const provinces = rwanda.Provinces(); // Fetch provinces for the form
        res.render('donorRegister', { title: 'Donor Register Page', provinces });
    } catch (error) {
        console.error('Error fetching provinces:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }
});

app.get('/provinces', (req, res) => {
    res.json(Provinces());
  });
  
  app.get('/districts/:province', (req, res) => {
    const province = req.params.province;
    res.json(Districts(province));
  });
  
  app.get('/sectors/:province/:district', (req, res) => {
    const { province, district } = req.params;
    res.json(Sectors(province, district));
  });
