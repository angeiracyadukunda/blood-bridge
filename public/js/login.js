// login.js
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const keepSignedIn = document.getElementById('keep-signed-in').checked;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, keepSignedIn }),
        });

        const data = await response.json();

        if (response.ok) {
            showPopup(data.message, "success");
            window.location.href = '/dashboard'; // Redirect to dashboard after successful login
        } else {
            showPopup(data.message, "error");
        }
    } catch (error) {
        console.error('Error logging in:', error);
        showPopup('An error occurred. Please try again later.', "error");
    }
});

// Check if the user is already logged in
(async function checkSession() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();

        if (data.loggedIn) {
            window.location.href = '/dashboard'; // Redirect to dashboard if already logged in
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
})();

// Function to show popup messages
function showPopup(message, type) {
    const popup = document.querySelector(".alert");
    popup.textContent = message;

    if (type === "success") {
        popup.style.backgroundColor = "green";
    } else if (type === "error") {
        popup.style.backgroundColor = "red";
    }

    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}
