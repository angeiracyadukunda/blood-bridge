// Function to initialize the schedule management features
document.addEventListener("DOMContentLoaded", () => {
    // Fetch existing schedules when the page loads
    fetchSchedules();

    // Toggle the schedule form visibility when the "+" button is clicked
    document.getElementById('add-schedule-btn').addEventListener('click', () => {
        const scheduleForm = document.getElementById('schedule-form');
        scheduleForm.classList.toggle('hidden');
    });

    // Add a new schedule when the "Add Schedule" button is clicked
    document.getElementById('submit-schedule').addEventListener('click', async () => {
        const timeRange = document.getElementById('time-range').value;
        const selectedDates = flatpickr.parseDate(document.getElementById('date-picker')._input.value, "Y-m-d"); // Get selected dates

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
            document.getElementById('date-picker')._input.value = ''; // Clear selected dates
        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    });
});

// Function to fetch and display existing schedules
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
                    <button class="edit-btn" data-id="${schedule.scheduleId}">Edit</button>
                    <button class="delete-btn" data-id="${schedule.scheduleId}">Delete</button>
                </td>
            `;
            schedulesTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
}

// Add event listener for delete buttons (delegated)
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const scheduleId = event.target.getAttribute('data-id');
        await deleteSchedule(scheduleId);
        fetchSchedules(); // Refresh the schedule list after deletion
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
