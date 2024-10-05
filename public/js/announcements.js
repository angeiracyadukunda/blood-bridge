// Function to fetch and display announcements
const fetchAnnouncements = async () => {
    const response = await fetch('/api/announcements'); // Make a GET request to fetch announcements
    const announcements = await response.json();
    const announcementsBody = document.getElementById('announcementsBody');
    announcementsBody.innerHTML = ''; // Clear the table body before populating

    announcements.forEach((announcement, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-gray-100' : 'bg-white';
        row.innerHTML += `
                <td class="py-2 px-4 border-b">${announcement.announcementType}</td>
                <td class="py-2 px-4 border-b">${announcement.announcementTitle}</td>
                <td class="py-2 px-4 border-b">${announcement.announcementDate}</td>
                <td class="py-2 px-4 border-b">${announcement.status}</td>
                <td class="py-2 px-4 border-b">
                    <button onclick="editAnnouncement(
                        '${announcement.announcementId}', 
                        '${announcement.announcementTitle}', 
                        '${announcement.announcementBody}', 
                        '${announcement.announcementDate}', 
                        '${announcement.announcementType}', 
                        '${announcement.announcementLocation}', 
                        '${announcement.status}'
                        )" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded m-1">
                        Edit
                    </button>
                    <button onclick="deleteAnnouncement(
                        '${announcement.announcementId}'
                        )" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded m-1">
                        Delete
                    </button>
                </td>
        `;
        announcementsBody.appendChild(row);
    });
};

// Function to handle form submission
let isEditMode = false; // Flag to track if we are in edit mode
let currentEditId = null; // Variable to store the ID of the announcement being edited

const editAnnouncement = (id, title, body, date, type, location, status) => {
    isEditMode = true; // Set edit mode
    currentEditId = id; // Store the ID for the update
    const announcementForm = document.getElementById('announcementForm');
    announcementForm.classList.remove('hidden');
    // Populate the form with current data
    document.querySelector('input[name="announcementTitle"]').value = title;
    document.querySelector('textarea[name="announcementBody"]').value = body;
    document.querySelector('input[name="announcementDate"]').value = date;
    document.querySelector('select[name="announcementType"]').value = type;
    document.querySelector('input[name="announcementLocation"]').value = location;

    // Create and populate the status select element
    const statusSelect = document.createElement('select');
    statusSelect.name = "status";
    statusSelect.id = "status";
    statusSelect.className = "p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
    
    const validOption = document.createElement('option');
    validOption.value = "valid";
    validOption.textContent = "Valid";
    statusSelect.appendChild(validOption);
    
    const expiredOption = document.createElement('option');
    expiredOption.value = "expired";
    expiredOption.textContent = "Expired";
    statusSelect.appendChild(expiredOption);

    // Set the current status value
    statusSelect.value = status;

    // Insert the status select before the submit button
    const form = document.getElementById('announcementForm');
    const existingStatusSelect = document.querySelector('select[name="status"]');

    if (existingStatusSelect) {
        form.removeChild(existingStatusSelect); // Remove previous status field if it exists
    }
    form.insertBefore(statusSelect, form.querySelector('button[type="submit"]'));

    // Optionally, change the submit button to an "Edit" button
    const editButton = document.createElement('button');
    editButton.type = 'submit';
    editButton.textContent = 'Edit Announcement';
    editButton.className = "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded";

    // Remove existing button and add edit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        form.removeChild(submitButton); // Remove the original submit button
    }
    form.appendChild(editButton);

    // Focus on the first input element to bring the cursor to the top of the form
    document.querySelector('input[name="announcementTitle"]').focus();
};

// Form submission handler
const announcementForm = document.getElementById('announcementForm');
announcementForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const formData = new FormData(e.target);
    const announcementData = Object.fromEntries(formData.entries());

    // Check if in edit mode
    if (isEditMode && currentEditId) {
        // Update the existing announcement via PUT request
        await fetch(`/api/announcements/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcementData)
        });

        isEditMode = false; // Reset edit mode flag
        currentEditId = null; // Clear current edit ID

        // Reset form and button text
        e.target.reset(); // Reset the form
        fetchAnnouncements(); // Refresh the announcements table

        // Show success message
        showMessage('Announcement updated successfully!', 'success');

    } else {
        // Add a new announcement via POST request
        await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcementData)
        });

        e.target.reset(); // Reset the form
        fetchAnnouncements(); // Refresh the announcements table
        
        // Show success message
        showMessage('Announcement added successfully!', 'success');
    }

    // Hide the form again after submission
    announcementForm.style.display = 'none';
});

// Function to show messages
const showMessage = (message, type) => {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.className = `p-4 my-4 text-white rounded ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    document.body.prepend(messageContainer);

    // Automatically remove the message after 3 seconds
    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
};

// Function to delete an announcement
const deleteAnnouncement = async (id) => {
    await fetch(`/api/announcements/${id}`, {
        method: 'DELETE'
    });
    fetchAnnouncements(); // Refresh the announcements table
};

// Function to show/hide the announcement form
const toggleAnnouncementForm = () => {
    const formL = document.getElementById('announcementForm');
    
    // Check if the form is hidden
    if (formL.classList.contains('hidden')) {
        formL.classList.remove('hidden'); // Show the form
        // Optionally clear the fields if needed when toggling for a new announcement
        document.querySelector('[name="announcementTitle"]').value = '';
        document.querySelector('[name="announcementBody"]').value = '';
        document.querySelector('[name="announcementType"]').value = '';
        document.querySelector('[name="announcementDate"]').value = '';
        document.querySelector('[name="announcementLocation"]').value = '';
        // Remove status field if it exists (since it's for editing only)
        const statusField = document.getElementById('status');
        if (statusField) {
            statusField.remove();
        }
    } else {
        formL.classList.add('hidden'); // Hide the form
    }
};



// Attach toggle function to the button
// document.getElementById('addAnnouncementButton').addEventListener('click', toggleAnnouncementForm);

// Initial fetch to populate the announcements table
fetchAnnouncements();
