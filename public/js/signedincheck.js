(async function checkSession() {
    try {
        const response = await fetch('/api/session'); // Fetch session data from server
        const data = await response.json();
        console.log("session data" +data);
        if (data.loggedIn) {
            const { uid, role } = data; // Extract uid and role from session data

            // Conditional redirect based on role
            if (role === 'recipient') {
                window.location.href = `/${uid}/dashboard`; // Redirect to recipient dashboard
            } else if (role === 'donor') {
                window.location.href = `/${uid}/donorsdashboard`; // Redirect to donor dashboard
            } else {
                console.error('Unknown role:', role);
            }
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
})();