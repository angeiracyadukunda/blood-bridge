document.addEventListener('DOMContentLoaded', function () {
    const addDonationBtn = document.getElementById('add-donation-btn');
    const donorDetailsModal = document.getElementById('donor-details-modal');
    const addDonationModal = document.getElementById('add-donation-modal');
    const updateStatusModal = document.getElementById('update-status-modal');
    const showAppointments = document.getElementById('appointments-list-modal');
    // Fetch and display donations
    fetch('/api/donations/list')
        .then(response => response.json())
        .then(data => {
            const donationsList = document.getElementById('donations-list');
            donationsList.innerHTML = '';  // Clear existing content
            data.forEach(donation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4">${donation.fullName}</td>
                    <td class="py-2 px-4">${new Date(donation.donationDate).toLocaleDateString()}</td>
                    <td class="py-2 px-4">${donation.bloodQuantity}</td>
                    <td class="py-2 px-4">
                        <button class="view-more-btn text-blue-500" data-donor-id="${donation.donorId}">View More</button>
                    </td>
                `;
                row.querySelector('.view-more-btn').addEventListener('click', () => {
                    openDonorDetailsModal(donation.donorId);
                });
                donationsList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching donations:', err));

    // Fetch and display appointments
    function fetchAppointments() {
        fetch('/api/donations/appointments/list')
            .then(response => response.json())
            .then(data => {
                const appointmentsList = document.getElementById('appointments-list');
                appointmentsList.innerHTML = ''; // Clear existing content
                data.forEach(appointment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-2 px-4">${appointment.scheduleDate}</td>
                        <td class="py-2 px-4">${appointment.donorName}</td>
                        <td class="py-2 px-4">${appointment.status}</td>
                        <td class="py-2 px-4">
                           <button class="open-add-donation-btn text-blue-500" 
                                    data-appointment-id="${appointment.appointmentId}" 
                                    data-donor-name="${appointment.donorName}" 
                                    data-donor-id="${appointment.donorId}" 
                                    data-donor-email="${appointment.donorEmail}" 
                                    data-donation-center="${appointment.donationCenter}" 
                                    data-status="${appointment.status}"
                                    data-donation-center-id="${appointment.centerId}"
                            >
                                Initiate Donation
                            </button>                        
                        </td>
                    `;
                    
                    // Add event listener to open the add donation form
                    row.querySelector('.open-add-donation-btn').addEventListener('click', (event) => {
                        const appointmentId = event.target.getAttribute('data-appointment-id'); // Get the appointment ID
                        const donorName = event.target.getAttribute('data-donor-name');
                        const donorId = event.target.getAttribute('data-donor-id');
                        const donor_email = event.target.getAttribute('data-donor-email');
                        const donationCenter = event.target.getAttribute('data-donation-center');
                        const status = event.target.getAttribute('data-status');
                        const centerId = event.target.getAttribute('data-donation-center-id');
                    
                        handleAddDonationClick({ appointmentId, donorName, donor_email, donationCenter, status, donorId, centerId }); // Pass an object with appointment data
                    });
                    
                    appointmentsList.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching appointments:', err));
    }
    
    // Handle the click on the Add Donation button
    function handleAddDonationClick(appointment) {
        const { donorName, donor_email, donationCenter, status, appointmentId, donorId, centerId } = appointment; // Get appointment ID from the parameter
        
        if (status === "pending") {
            
            updateStatusModal.classList.remove('hidden');
            
            const updateStatusBtn = document.getElementById('confirm-update-status-btn');
            if (updateStatusBtn) {
                updateStatusBtn.onclick = () => {
                    updateAppointmentStatus(appointmentId, () => { // Use the appointment ID here
                        try{
                            fillAddDonationForm(donorName, donor_email, donationCenter, donorId, centerId);
                        } catch (e){
                            console.error(e);
                        }
                        addDonationModal.classList.remove('hidden');
                        updateStatusModal.classList.add('hidden');
                    });
                };
            } else {
                console.error('Update Status Button not found in the DOM.');
            }
        } else {
            try{
                fillAddDonationForm(donorName, donor_email, donationCenter, donorId, centerId);
            } catch (e){
                console.error(e);
            }
            addDonationModal.classList.remove('hidden');
            showAppointments.classList.add('hidden');
        }
    }
    

    
    // Fill the Add Donation Form with data from the appointment
    function fillAddDonationForm(donorName, donor_email, donationCenter, donorId, centerId) {
        // Ensures it's treated as a string 
        document.getElementById('donor-name').value = donorName; // Assuming you have an input field for donor name
        document.getElementById('donorEmailInput').value = donor_email; 
        document.getElementById('donor-id-hidden').value = donorId;
        document.getElementById('donation-center').value = donationCenter;
        document.getElementById('donationCenter-id-hidden').value = centerId; // Assuming you have an input field for donation center
    }
    
    // Update appointment status
    // Function to show the status update modal and set the selected appointment ID
    let selectedAppointmentId = null;

    function showUpdateStatusModal(appointmentId) {
        selectedAppointmentId = appointmentId; // Store the selected appointment ID
        const updateStatusModal = document.getElementById('update-status-modal');
        updateStatusModal.classList.remove('hidden');
        
    }

    // Function to close the status update modal
    function closeUpdateStatusModal() {
        const updateStatusModal = document.getElementById('update-status-modal');
        updateStatusModal.classList.add('hidden');
    }
    const closeUpdateStatusModalBtn = document.getElementById('close-status-modal-btn');
    closeUpdateStatusModalBtn.addEventListener('click', closeUpdateStatusModal);

    // Confirm button functionality
    document.getElementById('confirm-update-status-btn').addEventListener('click', () => {
        const newStatus = document.getElementById('appointment-status').value;
        if (newStatus) {
            updateAppointmentStatus(selectedAppointmentId, () => {
                // Optional: Refresh the appointments list after updating status
                fetchAppointments(); // Call your existing function to refresh the list
            });
            closeUpdateStatusModal();
        }
    });

    // Function to update the appointment status
    function updateAppointmentStatus(appointmentId, callback) {
        const newStatus = document.getElementById('appointment-status').value; // Get the status from the modal
        if (!appointmentId) {
            console.error('Appointment ID is null or undefined:', appointmentId);
            return; // Exit the function if the appointment ID is not valid
        }
        if (newStatus) {
            fetch(`/api/donations/appointments/update/${appointmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Appointment status updated successfully!');
                    if (callback) {
                        callback(); // Call the callback function if status update is successful
                    }
                } else {
                    alert('Failed to update appointment status');
                }
            })
            .catch(err => console.error('Error updating appointment status:', err));
        }
    }
    

    const closeAppointmentsBtn = document.getElementById('closeAppointmentsModal');
    closeAppointmentsBtn.addEventListener('click', closeAppointmentsModal);

    // Function to close the Appointments Modal
    function closeAppointmentsModal() {
        const showAppointments = document.getElementById('appointments-list-modal');
        if (showAppointments) {
            showAppointments.classList.add('hidden'); 
        } else {
            console.error('Appointments Modal element not found');
        }
    }

    const closeDonorDetailsBtn = document.getElementById('closeModal');
    closeDonorDetailsBtn.addEventListener('click', closeDonorDetailsModal);

    // Function to close the Donor Details Modal
    function closeDonorDetailsModal() {
        const donorDetailsModal = document.getElementById('donor-details-modal');
        if (donorDetailsModal) {
            donorDetailsModal.classList.add('hidden'); 
        } else {
            console.error('Donor Details Modal element not found');
        }
    }

    const closeAddDonationBtn = document.getElementById('closeAddDonationModal');
    closeAddDonationBtn.addEventListener('click', closeAddDonationModal);

    // Function to close the Add Donation Modal
    function closeAddDonationModal() {
        const addDonationModal = document.getElementById('add-donation-modal');
        if (addDonationModal) {
            addDonationModal.classList.add('hidden'); // Hide the modal by adding 'hidden'
        } else {
            console.error('Add Donation Modal element not found');
        }
    }

    // Open Donor Details Modal
    function openDonorDetailsModal(donorId) {
        fetch(`/api/donations/donor/${donorId}`)
            .then(response => response.json())
            .then(donor => {
                document.getElementById('donor-full-name').innerText = donor.fullName;
                document.getElementById('donor-email').innerText = donor.email;
                document.getElementById('donor-gender').innerText = donor.gender;
                document.getElementById('donor-dob').innerText = new Date(donor.dob).toLocaleDateString();
                document.getElementById('donor-id-type').innerText = donor.idType;
                document.getElementById('donor-id-no').innerText = donor.idNo;
                document.getElementById('donor-weight').innerText = donor.weight;
                document.getElementById('donor-blood-group').innerText = donor.bloodGroup;
                document.getElementById('donor-province').innerText = donor.province;
                document.getElementById('donor-district').innerText = donor.district;
                document.getElementById('donor-sector').innerText = donor.sector;
                document.getElementById('donor-rewards').innerText = donor.rewards;
                document.getElementById('donor-bio').innerText = donor.bio;

                donorDetailsModal.classList.remove('hidden');
            })
            .catch(err => console.error('Error fetching donor details:', err));
    }

    // Close Modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function () {
            donorDetailsModal.classList.add('hidden');
            addDonationModal.classList.add('hidden');
        });
    });

    // Add Donation Button - Opens Add Donation Modal
    addDonationBtn.addEventListener('click', function () {
        fetchAppointments(); 
        const showAppointments = document.getElementById('appointments-list-modal');
        showAppointments.classList.remove('hidden'); 
        // Fetch appointments first before showing the modal
    });
    // Handle Add Donation Form Submission
    const addDonationForm = document.getElementById('add-donation-form');
    addDonationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addDonationForm);
        fetch('/api/donations/add', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Donation added successfully!');
                addDonationModal.classList.add('hidden');
                window.location.reload();  // Reload to show updated donation list
            } else {
                alert('Failed to add donation');
            }
        })
        .catch(err => console.error('Error adding donation:', err));
    });

    // Initial fetching of appointments when the page loads
    fetchAppointments();
});
