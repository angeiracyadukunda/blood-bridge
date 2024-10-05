document.addEventListener("DOMContentLoaded", () => {
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');

    // Fetch all appointments from the server
    const fetchAppointments = async (loading = false) => {
        // Show the loading spinner if the loading parameter is true
        if (loading) {
            document.getElementById('loading-spinner').classList.remove('hidden');
        }
    
        try {
            const response = await fetch('/api/admin/appointments/all');
            const appointments = await response.json();
    
            // Clear the table first
            appointmentsTableBody.innerHTML = '';
    
            // Populate the table with appointments
            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border px-4 py-2">${appointment.fullName}</td>
                    <td class="border px-4 py-2">${appointment.centerName}</td>
                    <td class="border px-4 py-2">${appointment.scheduleDate}</td>
                    <td class="border px-4 py-2">${appointment.scheduleTime}</td>
                    <td class="border px-4 py-2">${appointment.status}</td>
                    <td class="border px-4 py-2" id="action-${appointment.appointmentId}">
                        <!-- Action buttons will be added here dynamically -->
                    </td>
                `;
                appointmentsTableBody.appendChild(row);
    
                // Add action buttons after rendering the row
                const actionCell = document.getElementById(`action-${appointment.appointmentId}`);
                actionCell.appendChild(getActionButtons(appointment));
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            // Hide the loading spinner after fetching appointments
            if (loading) {
                document.getElementById('loading-spinner').classList.add('hidden');
            }
        }
    };
    
    
    // Generate action buttons and add event listeners
    const getActionButtons = (appointment) => {
        const container = document.createElement('div');
    
        if (appointment.status === 'pending') {
            const approveButton = document.createElement('button');
            approveButton.className = 'bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mb-2';
            approveButton.textContent = 'Approve';
            approveButton.addEventListener('click', () => handleStatusUpdate(appointment.appointmentId, 'approved'));
    
            const denyButton = document.createElement('button');
            denyButton.className = 'bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded';
            denyButton.textContent = 'Deny';
            denyButton.addEventListener('click', () => handleStatusUpdate(appointment.appointmentId, 'denied'));
    
            container.appendChild(approveButton);
            container.appendChild(denyButton);
        } else if (appointment.status === 'approved') {
            const denyButton = document.createElement('button');
            denyButton.className = 'bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded';
            denyButton.textContent = 'Deny';
            denyButton.addEventListener('click', () => handleStatusUpdate(appointment.appointmentId, 'denied'));
    
            container.appendChild(denyButton);
        } else if (appointment.status === 'denied') {
            const approveButton = document.createElement('button');
            approveButton.className = 'bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded';
            approveButton.textContent = 'Approve';
            approveButton.addEventListener('click', () => handleStatusUpdate(appointment.appointmentId, 'approved'));
    
            container.appendChild(approveButton);
        }
    
        return container;
    };
    
    // Function to handle status updates
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
        
        try {
            await updateAppointmentStatus(appointmentId, newStatus);
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };
    
    // Function to update the appointment status via an API call
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            console.log('Sending update request...');
            
            const response = await fetch(`/api/admin/appointments/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appointmentId, status: newStatus }),
            });
    
    
            console.log('Appointment status updated successfully');
            alert(`The appointment has been updated to ${newStatus}`);

            // Reload the parent iframe (contentFrame)
    
            // Reload appointments after updating the status
            fetchAppointments(true);
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };
    
    // Initial call to fetch and display appointments
    fetchAppointments();
});
