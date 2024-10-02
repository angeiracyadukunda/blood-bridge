(async function checkSession() {
    try {
        const response = await fetch('/api/session'); // Fetch session data from server
        const data = await response.json();
        const signInLink = document.querySelector('#sign-in-link'); // Update this selector to match your HTML structure

        if (data.loggedIn) {
            const { fullName, uid, role } = data.user; // Extract fullName from session data
         
            signInLink.textContent = ""; // Display the user's name
            
            const initial = fullName.charAt(0).toUpperCase(); // Get the initial of the full name
            signInLink.innerHTML = `
                <div class="flex items-center ">
                    <span class="user-circle flex items-center justify-center w-8 h-8 border-2 border-gray-500 rounded-full text-sm text-gray-500">
                        <!-- Show icon on medium and larger screens -->
                        <i class="fas fa-user md:block hidden"></i>
                        <!-- Show the initial on small screens -->
                        <span class="md:hidden">${initial}</span>
                    </span>
                    <!-- Show full name only on medium and larger screens -->
                    <b class="full-name ml-2 hidden md:inline">${fullName}</b>
                </div>
            `;

            
            console.log("Full name: "+fullName);
            if (role === "donor"){
                signInLink.href = `/${uid}/donorsdashboard/profile`;
            }else if(role === "recipient"){
                signInLink.href = `/${uid}/dashboard`;
            } // Redirect to the user's profile if clicked
        } else {
            signInLink.textContent = 'Sign In'; // Keep 'Sign In' if not logged in
            signInLink.href = '/login'; // Link to the login page
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
})();