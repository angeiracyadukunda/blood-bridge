const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fbConfig = './Backend/firebase/firebaseConfig';
const {authentication, liveDatabase, db } = require(fbConfig); // Import the database instance
const { ref, push, set } = require('firebase/database');
const rwanda = require('rwanda');
require('dotenv').config(); 

// const signupRoutes = require('./Backend/routes/signupRoute');
const authRoutes = require('./Backend/routes/authRoute'); 
const loginRoutes = require('./Backend/routes/loginRoute');
const signupRoute = require('./Backend/routes/signupRoute');
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
    secret: process.env.SESSION_KEY, // Use a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 180 * 24 * 60 * 60 * 1000
     } // Set to true if using HTTPS in production
}));

// Routes
//app.use('/api', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', signupRoute);

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

    const donorData = {
        title: 'View My Donor Card',
        bloodGroup: "O+",
        donationDate: "2024-09-27",
        timesOfDonation: 3,
        rhesus: "Positive",
        signature: "John Doe",
        location: "Kigali, Rwanda",
        dob: "1990-01-15",
        firstBloodCheck: "Normal",
        secondBloodCheck: "Normal",
        doctorName: "Dr. Sarah Smith",
        cardNo: "123456",
        bloodQuantity: "500ml"
    };

    // Render the donor card template and pass the donorData to it
    res.render('donorsdashboard/donor-card', donorData);
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

app.get('/districts/:province', (req, res) => {
    const province = req.params.province;
    const districts = districts.filter(district => district.province === province); // Example filtering
    res.json(districts);
});

// Endpoint to get sectors based on district
app.get('/sectors/:district', (req, res) => {
    const district = req.params.district;
    const sectors = Sectors.filter(sector => sector.district === district); // Example filtering
    res.json(sectors);
});

// Endpoint to get cells based on sector
app.get('/cells/:sector', (req, res) => {
    const sector = req.params.sector;
    const cells = Cells.filter(cell => cell.sector === sector); // Example filtering
    res.json(cells);
});

// Endpoint to get villages based on cell
app.get('/villages/:cell', (req, res) => {
    const cell = req.params.cell;
    const villages = Villages.filter(village => village.cell === cell); // Example filtering
    res.json(villages);
});
