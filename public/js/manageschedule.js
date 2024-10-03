document.addEventListener("DOMContentLoaded", () => {
    // Fetch existing schedules when the page loads
    fetchSchedules();

    // Toggle the schedule form visibility when the "+" button is clicked
    document.getElementById('add-schedule-btn').addEventListener('click', () => {
        const scheduleForm = document.getElementById('schedule-form');
        scheduleForm.classList.toggle('hidden');
        document.getElementById('edit-form').classList.add('hidden'); // Hide edit form if it was previously shown
    });

    // Add a new schedule when the "Add Schedule" button is clicked
    document.getElementById('submit-schedule').addEventListener('click', async () => {
        const timeRange = document.getElementById('time-range').value;
        const selectedDates = document.getElementById('date-picker')._flatpickr.selectedDates; // Get selected dates

        try {
            // Iterate over each selected date and send to the server
            for (const date of selectedDates) {
                const scheduleData = { date: date.toISOString().split('T')[0], timeRange }; // Format date for DB
                const response = await fetch('/api/schedules', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(scheduleData),
                });

                if (!response.ok) {
                    console.error('Error adding schedule:', await response.json());
                }
            }

            fetchSchedules(); // Refresh the schedule list after adding
            document.getElementById('schedule-form').classList.add('hidden'); // Hide the form
            document.getElementById('time-range').value = ''; // Clear time range input
            document.getElementById('date-picker')._flatpickr.clear();// Clear selected dates
        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    });
});

// Fetch and display existing schedules
async function fetchSchedules() {
    try {
        const response = await fetch('/api/schedules');
        const schedules = await response.json();

        const schedulesTable = document.getElementById('schedules-table');
        schedulesTable.innerHTML = ''; // Clear existing schedules

        schedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.className = 'bg-gray-100'; // Alternating row color
            row.innerHTML = `
                <td class="py-2 px-4">${schedule.date}</td>
                <td class="py-2 px-4">${schedule.timeRange}</td>
                <td class="py-2 px-4">
                    <!-- Edit Button -->
                    <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" data-id="${schedule.scheduleId}" data-date="${schedule.date}" data-time="${schedule.timeRange}">
                        Edit
                    </button>

                    <!-- Delete Button -->
                    <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2" data-id="${schedule.scheduleId}">
                        Delete
                    </button>
                </td>
            `;
            schedulesTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
}

// Add event listener for edit buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        const scheduleId = event.target.getAttribute('data-id');
        const date = event.target.getAttribute('data-date');
        const timeRange = event.target.getAttribute('data-time');
        
        // Show the edit form with pre-filled values
        const scheduleForm = document.getElementById('schedule-form');
        scheduleForm.classList.add('hidden');
        const editForm = document.getElementById('edit-form');
        editForm.classList.remove('hidden');

        // Pre-fill the form with the existing values
        document.getElementById('edit-date-picker').value = date;
        document.getElementById('edit-time-range').value = timeRange;

        // Handle the submit for editing the schedule
        document.getElementById('submit-edit-schedule').addEventListener('click', async () => {
            const newDate = document.getElementById('edit-date-picker').value;
            const newTimeRange = document.getElementById('edit-time-range').value;

            const response = await fetch(`/api/schedules/${scheduleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: newDate, timeRange: newTimeRange }),
            });

            if (response.ok) {
                fetchSchedules(); // Refresh schedule list after edit
                editForm.classList.add('hidden'); // Hide edit form
                scheduleForm.classList.remove('hidden'); // Show add schedule form again
            } else {
                console.error('Error updating schedule:', await response.json());
            }
        });
    }
});

// Add event listener for delete buttons
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const scheduleId = event.target.getAttribute('data-id');
        
        // Show confirmation dialog
        const isConfirmed = confirm('Are you sure you want to delete this schedule?');
        
        if (isConfirmed) {
            await deleteSchedule(scheduleId);
            fetchSchedules(); // Refresh the schedule list after deletion
        }
    }
});

// Function to delete a schedule
async function deleteSchedule(scheduleId) {
    try {
        const response = await fetch(`/api/schedules/${scheduleId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error('Error deleting schedule:', await response.json());
        }
    } catch (error) {
        console.error('Error deleting schedule:', error);
    }
}
