document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form-submit");
    const formSubmitBtn = document.getElementById("appointment-form-submit");
    const donationCenterSelect = document.getElementById("donationCenter");
    const scheduleDateSelect = document.getElementById("scheduleDate");
    const bloodGroupSelect = document.getElementById("bloodGroup");

    // Function to show a styled popup message
    function showPopupMessage(message) {
        // Create the popup element
        const popup = document.createElement('div');
        popup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-6 z-50'; // Tailwind classes
        popup.innerHTML = `
            <p class="text-center text-gray-700">${message}</p>
            <button id="close-popup" class="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600">Close</button>
        `;

        // Append to body
        document.body.appendChild(popup);

        // Close button event listener
        document.getElementById('close-popup').addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        // Optional: Automatically remove after a few seconds
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 5000);
    }

    // Function to check user authentication
    async function checkAuthentication() {
        try {
            const session = await fetch('/api/session');
            const data = await session.json();

            if (!data.loggedIn) {
                showPopupMessage("Please log in first to schedule an appointment.");
                return false; // Not authenticated
            }
            return true; // Authenticated
        } catch (error) {
            console.error("Failed to check authentication:", error);
            return false; // Assume not authenticated on error
        }
    }

    // Submit form data for scheduling an appointment
    formSubmitBtn.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Check if the user is authenticated
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            // Store the form data in local storage to retrieve later
            const formData = new FormData(formSubmitBtn);
            const appointmentData = {
                province: formData.get("province"),       // No change
                district: formData.get("district"),       // No change
                sector: formData.get("sector"),           // No change
                phone: formData.get("phone"),             // Aligned with controller
                centerId: formData.get("donationCenter"), // Aligned to controller (changed from "donationCenter" to "centerId")
                scheduleDate: formData.get("scheduleDate"), // No change
                scheduleTime: formData.get("scheduleTime"), // No change
                bloodGroup: formData.get("bloodGroup"),   // No change
                notes: formData.get("notes")              // No change
            };
            localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
            setTimeout(() => {
                window.location.href = '/login'; // Redirect to the login page after showing the message
            }, 2000); // Adjust delay as necessary
            return;
        }

        const formData = new FormData(formSubmitBtn);
        const appointmentData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            dob: formData.get("dob"),
            province: formData.get("province"),
            district: formData.get("district"),
            sector: formData.get("sector"),
            centerId: formData.get("donationCenter"),
            scheduleDate: formData.get("scheduleDate"),
            scheduleTime: formData.get("scheduleTime"),
            bloodGroup: formData.get("bloodGroup"),
            notes: formData.get("notes")
        };

        try {
            const response = await fetch(`/api/${data.user.uid}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                alert("Appointment scheduled successfully!");
                window.location.reload(); // Reload the page after successful scheduling
            } else {
                console.error("Error scheduling appointment.");
                showPopupMessage("Failed to schedule appointment. Please try again.");
            }
        } catch (error) {
            console.error("Failed to schedule appointment:", error);
            showPopupMessage("An error occurred. Please try again later.");
        }
    });

    // Fetch and populate donation centers
    async function fetchDonationCenters() {
        try {
            const response = await fetch("/api/donation-centers");
            const centers = await response.json();
            
            centers.forEach(center => {
                const option = document.createElement('option');
                option.value = center.id;
                option.textContent = `${center.name} | ${center.province}`;
                donationCenterSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching donation centers:', error);
        }
    }

    // Fetch and populate available schedules
    async function fetchSchedules() {
        try {
            const response = await fetch("/api/schedules");
            const schedules = await response.json();
            
            schedules.forEach(schedule => {
                const option = document.createElement('option');
                option.value = schedule.date;
                option.textContent = schedule.date;
                scheduleDateSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    }

    // Fetch blood types (static example or from endpoint)
    function fetchBloodTypes() {
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        
        bloodTypes.forEach(bloodType => {
            const option = document.createElement('option');
            option.value = bloodType;
            option.textContent = bloodType;
            bloodGroupSelect.appendChild(option);
        });
    }

    // Load all necessary data when the page loads
    fetchDonationCenters();
    fetchSchedules();
    fetchBloodTypes();
});
