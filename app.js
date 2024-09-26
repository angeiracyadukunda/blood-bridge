const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {User,
    Receiver,
    Appointment,
    NotificationReminder,
    BloodDonationCard,
    ContactUs,
    Approval } = require('./Backend/model')

// Express app
const app = express();

//connecting to mngodb
const uri = "mongodb+srv://gdm:8520@blooddonation.dgdu5.mongodb.net/?retryWrites=true&w=majority&appName=blooddonation";
// mongoose.connect(uri)
//  .then(() => console.log('Connected to MongoDB...'))
// .then((result)=> app.listen(3000,()=>{
//     console.log("listening to port 3000");
//     }))
// .catch((err) => console.log(err));

app.listen(3000,()=>{
    console.log("listening to port 3000");
    });

// Register view engine
app.set('view engine', 'ejs');

// Middleware to serve static files (CSS, JS, images, etc.)


// Listen for requests
app.use(express.static('public'));
app.use(morgan('dev'));

app.post(`/create-user`, (req, res) => {

    try {
        // Get data from query parameters or use default values
        const { email, role, fullName, phoneNumber, preferredLocation, dateOfBirth } = query.body;

        // Create a new user using the Mongoose model
        const newUser = new User({
            email,
            role,
            fullName,
            phoneNumber,
            preferredLocation,
            dateOfBirth
        });
    
        newUser.save()
            .then(() => res.status(201).send('User created successfully'))
            .catch(err => res.status(500).send('Error creating user'));
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

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
    res.render('beforeafter', { title: 'What to Do Before, During, and After Blood Donation' });
});
app.get('/benefits', (req, res) => {
    res.render('benefits', { title: 'Benefits of Blood Donation' });
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
app.get('/dashboard', (req, res) => {
    res.render('dashboard/maindashboard', { title: 'Dashboard' });
});
app.get('/dashboard/profile', (req, res) => {
    res.render('dashboard/profile', { title: 'Dashboard' });
});
app.get('/dashboard/dashboard-overview', (req, res) => {
    res.render('dashboard/dashboard-overview', { title: 'Dashboard' });
});

app.get('/dashboard/manage-appointments', (req, res) => {
    res.render('dashboard/manage-appointments', { title: 'Dashboard' });
});
app.get('/dashboard/manage-donors', (req, res) => {
    res.render('dashboard/manage-donors', { title: 'Dashboard' });
});
app.get('/dashboard/post-announcements', (req, res) => {
    res.render('dashboard/post-announcements', { title: 'Dashboard' });
});

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
app.get('/eligibility', (req, res) => {
    res.render('eligibility', { title: 'Eligibility Requirements' });
});
app.get('/firsttimedoner', (req, res) => {
    res.render('firsttimedoner', { title: 'First-Time Blood Donors' });
});
app.get('/forgotpassword', (req, res) => {
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
    res.render('signup', { title: 'Login Page' });
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
