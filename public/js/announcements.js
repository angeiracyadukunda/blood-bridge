// Function to fetch and display announcements
const fetchAnnouncements = async () => {
    const response = await fetch('/api/announcements'); // Make a GET request to fetch announcements
    const announcements = await response.json();
    const announcementsBody = document.getElementById('announcementsBody');
    announcementsBody.innerHTML = ''; // Clear the table body before populating

    announcements.forEach(announcement => {
        announcementsBody.innerHTML += `
            <tr>
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
                        )" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </button>
                    <button onclick="deleteAnnouncement(
                        '${announcement.announcementId}'
                        )" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
};

// Function to handle form submission
// Global variable to track edit mode
let isEditMode = false; // Flag to track if we are in edit mode
let currentEditId = null; // Variable to store the ID of the announcement being edited

const editAnnouncement = (id, title, body, date, type, location, status) => {
    isEditMode = true; // Set edit mode
    currentEditId = id; // Store the ID for the update

    // Populate the form with current data
    document.querySelector('input[name="announcementTitle"]').value = title;
    document.querySelector('textarea[name="announcementBody"]').value = body;
    document.querySelector('input[name="announcementDate"]').value = date;
    document.querySelector('select[name="announcementType"]').value = type;
    document.querySelector('input[name="announcementLocation"]').value = location;

    // Create and populate the status select element
    const statusSelect = document.createElement('select');
    statusSelect.name = "status";
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
document.getElementById('announcementForm').addEventListener('submit', async (e) => {
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

        // Reset to original submission
        isEditMode = false; // Reset edit mode flag
        currentEditId = null; // Clear current edit ID

        // Reset form and button text
        e.target.reset(); // Reset the form
        fetchAnnouncements(); // Refresh the announcements table

        // Change button back to "Post Announcement"
        const postButton = document.createElement('button');
        postButton.type = 'submit';
        postButton.textContent = 'Post Announcement';
        postButton.className = "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded";
        const form = document.getElementById('announcementForm');
        const editButton = form.querySelector('button[type="submit"]');
        
        if (editButton) {
           form.removeChild(editButton); // Remove the original submit button
        }
        form.appendChild(postButton);
    } else {
        // Add a new announcement via POST request
        await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcementData)
        });

        e.target.reset(); // Reset the form
        fetchAnnouncements(); // Refresh the announcements table
    }
});

// Example function to call when creating announcements
const createAnnouncement = async (data) => {
    // Call this function to create an announcement if not in edit mode
    // You can use this function in your other parts of the code as needed
    await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};


// Function to delete an announcement
const deleteAnnouncement = async (id) => {
    await fetch(`/api/announcements/${id}`, {
        method: 'DELETE'
    });
    fetchAnnouncements(); // Refresh the announcements table
};

// Function to edit an announcement
// const editAnnouncement = (id, title, body, date, type, location, status) => {
//     // Populate the form with current data
//     document.querySelector('input[name="announcementTitle"]').value = title;
//     document.querySelector('textarea[name="announcementBody"]').value = body;
//     document.querySelector('input[name="announcementDate"]').value = date;
//     document.querySelector('select[name="announcementType"]').value = type;
//     document.querySelector('input[name="announcementLocation"]').value = location;

//     // Create and populate the status select element
//     const statusSelect = document.createElement('select');
//     statusSelect.name = "status";
//     statusSelect.className = "p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
    
//     const validOption = document.createElement('option');
//     validOption.value = "valid";
//     validOption.textContent = "Valid";
//     statusSelect.appendChild(validOption);
    
//     const expiredOption = document.createElement('option');
//     expiredOption.value = "expired";
//     expiredOption.textContent = "Expired";
//     statusSelect.appendChild(expiredOption);

//     // Set the current status value
//     statusSelect.value = status;

//     // Insert the status select before the submit button
//     const form = document.getElementById('announcementForm');

//     const existingStatusSelect = document.querySelector('select[name="status"]');

//     if (existingStatusSelect) {
//         form.removeChild(existingStatusSelect); // Remove previous status field if it exists
//     }
//     form.insertBefore(statusSelect, form.querySelector('button[type="submit"]'));

//     // Change form submission to update
//     form.onsubmit = async (e) => {
//         e.preventDefault(); // Prevent form from refreshing the page
//         const formData = new FormData(e.target);
//         const announcementData = Object.fromEntries(formData.entries());

//         // Update the existing announcement via PUT request
//         await fetch(`/api/announcements/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(announcementData)
//         });

//         e.target.reset(); // Reset the form
//         fetchAnnouncements(); // Refresh the announcements table
//         form.onsubmit = null; // Reset to original submission
//     };
// };

// Fetch announcements when the page loads
document.addEventListener('DOMContentLoaded', fetchAnnouncements);
