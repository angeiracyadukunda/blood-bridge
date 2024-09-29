// authController.js
const { signInWithEmailAndPassword } = require('firebase/auth');
const fbConfig = '../firebase/firebaseConfig';
const { authentication } = require(fbConfig);

// Login Controller
const loginUser = async (req, res) => {
    const { username, password, keepSignedIn } = req.body;

    try {
        // Firebase Authentication: Sign in the user
        const userCredential = await signInWithEmailAndPassword(authentication, username, password);
        const user = userCredential.user;

        // Keep the user logged in for 3 months if 'keepSignedIn' is true
        if (keepSignedIn) {
            req.session.cookie.maxAge = 90 * 24 * 60 * 60 * 1000; // 3 months in milliseconds
        } else {
            req.session.cookie.expires = false; // Session ends when the browser is closed
        }
        


        // Save user session
        req.session.user = {
            uid: user.uid,
            email: user.email,
        };

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: 'Invalid login credentials' });
    }
};

// Check if the user is logged in
const checkUserSession = (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    }
    return res.status(401).json({ loggedIn: false });
};

// Logout Controller
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = { loginUser, checkUserSession, logoutUser };
