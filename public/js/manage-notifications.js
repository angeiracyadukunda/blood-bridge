// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Toggle visibility of the notification form
    document.getElementById('toggleNotificationForm').addEventListener('click', function() {
        const notificationForm = document.getElementById('notificationForm');
        notificationForm.classList.toggle('hidden');
    });

    // Toggle visibility of the donor selection form
    document.getElementById('toggleDonorForm').addEventListener('click', function() {
        const donorForm = document.getElementById('donorForm');
        donorForm.classList.toggle('hidden');
    });

    
    // Fetch and display donors
    async function fetchDonors() {
        try {
            const response = await fetch('/api/sendNotification/getDonors');
            if (!response.ok) throw new Error('Network response was not ok');

            const donors = await response.json();
            const donorContainer = document.getElementById('donors');
            donorContainer.innerHTML = ''; // Clear existing content

            donors.forEach(donor => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `donor-${donor.id}`;
                checkbox.name = 'donors[]';  // Allow multiple donors to be selected
                checkbox.value = JSON.stringify(donor); // Store whole donor object as a string

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = donor.fullName; // Assuming 'fullName' is a property of the donor object

                const div = document.createElement('div');
                div.classList.add('donor-item', 'flex', 'items-center', 'mb-2');
                div.appendChild(checkbox);
                div.appendChild(label);

                donorContainer.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching donors:', error);
        }
    }

    // Select all donors
    function selectAllDonors() {
        const checkboxes = document.querySelectorAll('input[name="donors[]"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true; // Check each checkbox
        });
    }

    // Deselect all donors
    function deselectAllDonors() {
        const checkboxes = document.querySelectorAll('input[name="donors[]"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Uncheck each checkbox
        });
    }

    // Submit notification form
    async function submitForm(event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const notificationType = document.getElementById('notificationType').value;
        const notificationMessage = document.getElementById('notificationMessage').value;
        const selectedDonors = Array.from(document.querySelectorAll('input[name="donors[]"]:checked')).map(donor => JSON.parse(donor.value)); // Parse the whole donor object

        // Validate input
        if (!notificationMessage.trim()) {
            alert('Please enter a notification message.');
            return;
        }
        if (selectedDonors.length === 0) {
            alert('Please select at least one donor.');
            return;
        }

        const formData = {
            subject: notificationType,
            message: notificationMessage,
            users: selectedDonors, // Sending the whole donor object
        };

        // Send data to the server
        try {
            const response = await fetch('/api/sendNotification/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Notification sent successfully!');
                document.getElementById('notificationForm').reset(); // Reset the form after submission
                document.getElementById('donorForm').classList.add('hidden'); // Hide donor form after submission
            } else {
                alert('Error sending notification. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    // Call the function to fetch donors on page load
    fetchDonors();

    // Attach event listeners for Select All and Deselect All buttons
    document.getElementById('selectAllButton').addEventListener('click', selectAllDonors);
    document.getElementById('deselectAllButton').addEventListener('click', deselectAllDonors);

    // Attach submit handler to the notification form
    document.getElementById('notificationForm').addEventListener('submit', submitForm);
});
