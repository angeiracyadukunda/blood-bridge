document.addEventListener("DOMContentLoaded", () => {
    const scheduleBtn = document.querySelectorAll("#schedule-btn");
    const appointmentForm = document.getElementById("appointment-form");
    const formSubmitBtn = document.getElementById("appointment-form-submit");
    const appointmentsContainer = document.getElementById("appointmentsContainer"); // Container for displaying appointments
    const donationCenterSelect = document.getElementById("donationCenter");
    const scheduleDateSelect = document.getElementById("scheduleDate");
    const bloodGroupSelect = document.getElementById("bloodGroup");
    // Target the table body
    let appointmentID="";
    let appointmentTIME="";
    
    // Fetch appointments from the server
    const fetchAppointments = async () => {
        try {
            const response = await fetch("/api/appointments");
            if (response.ok) {
                const appointments = await response.json(); // Parse the array directly
                console.log("Appointments:", appointments); // Now appointments is the array
                displayAppointments(appointments); // Pass the array to displayAppointments
            } else {
                console.error("Error fetching appointments");
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };
    

    // Display fetched appointments in the UI
    const displayAppointments = (appointments) => {
        //appointmentsContainer.innerHTML = ""; // Clear previous appointments

        // Table header
        // appointmentsContainer.innerHTML = `
        //     <thead>
        //         <tr class="bg-gray-200">
        //             <th class="border border-gray-300 px-4 py-2 text-left">Center</th>
        //             <th class="border border-gray-300 px-4 py-2 text-left">Schedule Time</th>
        //             <th class="border border-gray-300 px-4 py-2 text-left">Notes</th>
        //             <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         <!-- Appointment rows will be inserted here -->
        //     </tbody>
        // `;

        const tbody = document.getElementById("appointments-list");

        // If no appointments exist, show a message
        if (appointments.length === 0) {
            const noAppointmentsRow = document.createElement("tr");
            noAppointmentsRow.innerHTML = `
                <td colspan="4" class="text-center py-4 text-gray-500">No appointments available</td>
            `;
            tbody.appendChild(noAppointmentsRow);
        } else {
            // Display appointments in rows
            appointments.forEach((appointment, index) => {
                const appointmentRow = document.createElement("tr");
                appointmentRow.className = index % 2 === 0 ? "bg-gray-100" : "bg-white"; // Alternate row colors
                appointmentID=appointment.appointmentId;
                appointmentTIME=appointment.scheduleDate;
                appointmentRow.innerHTML = `
                    <td class="border border-gray-200 px-4 py-2">${appointment.centerName}</td>
                    <td class="border border-gray-200 px-4 py-2">${appointment.scheduleDate}</td>
                    <td class="border border-gray-200 px-4 py-2">${appointment.notes}</td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                        <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2" data-id="${appointment.appointmentId}">
                            Delete
                        </button>
                    </td>
                `;

                // Attach edit and delete event listeners
                appointmentRow.querySelector(".delete-btn").addEventListener("click", handleDelete);

                tbody.appendChild(appointmentRow);
            });
        }
    };

    // Handle editing an appointment
    const handleEdit = (event) => {
        const appointmentId = event.target.getAttribute("data-id");
        const scheduleDate = event.target.getAttribute("data-date");

        // Redirect to the edit page with appointment details
        window.location.href = `/api/appointments/edit/${appointmentID}?date=${appointmentTIME}`;
    };

    // Handle deleting an appointment
    const handleDelete = async (event) => {
        const appointmentId = event.target.getAttribute("data-id");

        if (confirm("Are you sure you want to delete this appointment?")) {
            try {
                const response = await fetch(`/api/appointments/delete/${appointmentID}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Appointment deleted successfully!");
                    // Remove the deleted appointment from the UI
                    event.target.closest("tr").remove();
                } else {
                    alert("Failed to delete the appointment. Please try again.");
                }
            } catch (error) {
                alert("Error deleting appointment: " + error.message);
            }
        }
    };

    // Submit form data for scheduling an appointment
    formSubmitBtn.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(formSubmitBtn);
        const appointmentData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            dob: formData.get("dob"),
            province: formData.get("province"),
            district: formData.get("district"),
            sector: formData.get("sector"),
            centerId:formData.get("donationCenter"),
            scheduleDate: formData.get("scheduleDate"),
            scheduleTime: formData.get("scheduleTime"),
            bloodGroup: formData.get("bloodGroup"),
            notes: formData.get("notes")
        };

        try {
            const session = await fetch('/api/session');
                const data = await session.json();
                const response = await fetch(`/api/${data.loggedIn ? data.user.uid :""}/appointments`, {
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
            }
        } catch (error) {
            console.error("Failed to schedule appointment:", error);
        }
    });

    // Show the appointment form when the schedule button is clicked
    scheduleBtn.forEach(btn => {
        btn.addEventListener("click", async () => {
            // Show the appointment form
            appointmentForm.classList.remove("hidden");

            try {
                // Fetch session data from /api/session
                const response = await fetch('/api/session');
                
                if (response.ok) {
                    const data = await response.json();

                    // Check if the user is logged in
                    if (data.loggedIn) {
                        const { fullName, email } = data.user;
                        
                        // Populate the form fields with the session data
                        const nameInput = document.getElementById('name');
                        const emailInput = document.getElementById('email');
                        
                        // Set the value of name and email fields
                        if (nameInput && emailInput) {
                            nameInput.value = fullName;  // Set full name
                            emailInput.value = email;    // Set email
                        }
                    } else {
                        console.error('User is not logged in');
                    }
                } else {
                    console.error('Failed to fetch session data');
                }
            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        });
    });

    // Fetch and display appointments on page load
    fetchAppointments();

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
                option.id="scheduleDate";
                option.name="scheduleDate";
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
            option.id="bloodGroup";
            option.name="bloodGroup";
            bloodGroupSelect.appendChild(option);
        });
    }

    // Load all necessary data when the page loads
    fetchDonationCenters();
    fetchSchedules();
    fetchBloodTypes();
});
