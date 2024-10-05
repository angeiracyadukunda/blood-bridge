document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to filter elements
    document.getElementById('genderFilter').addEventListener('change', updateFilters);
    document.getElementById('provinceFilter').addEventListener('change', updateFilters);
    document.getElementById('bloodGroupFilter').addEventListener('change', updateFilters);

    // Initial fetch of dashboard data
    fetchDashboardData({});
});

// Function to fetch data based on filters
const fetchDashboardData = async (filters) => {
    try {
        // Show skeletons while data is being fetched
        showSkeletons();

        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/admin/dashboard?${queryParams}`);
        const { donors, donations, appointments } = await response.json();

        // Apply filters
        const filteredDonors = donors.filter(donor => {
            const genderMatch = filters.gender ? donor.gender.toLowerCase() === filters.gender.toLowerCase() : true;
            const provinceMatch = filters.province ? donor.province.toLowerCase() === filters.province.toLowerCase() : true;
            const bloodGroupMatch = filters.bloodGroup ? donor.bloodGroup.toLowerCase() === filters.bloodGroup.toLowerCase() : true;

            return genderMatch && provinceMatch && bloodGroupMatch;
        });

        const filteredDonations = donations.filter(donation => {
            const donor = donation.donor;
            const genderMatch = filters.gender ? donor.gender.toLowerCase() === filters.gender.toLowerCase() : true;
            const provinceMatch = filters.province ? donor.province.toLowerCase() === filters.province.toLowerCase() : true;
            const bloodGroupMatch = filters.bloodGroup ? donor.bloodGroup.toLowerCase() === filters.bloodGroup.toLowerCase() : true;

            return genderMatch && provinceMatch && bloodGroupMatch;
        });

        const filteredAppointments = appointments.filter(appointment => {
            const donor = appointment.donor;
            const genderMatch = filters.gender ? donor.gender.toLowerCase() === filters.gender.toLowerCase() : true;
            const provinceMatch = filters.province ? donor.province.toLowerCase() === filters.province.toLowerCase() : true;
            const bloodGroupMatch = filters.bloodGroup ? donor.bloodGroup.toLowerCase() === filters.bloodGroup.toLowerCase() : true;

            return genderMatch && provinceMatch && bloodGroupMatch;
        });

        // Render filtered data
        renderDiagrams(filteredDonations, filteredDonors, filteredAppointments);
        renderTables(filteredDonors, filteredDonations, filteredAppointments);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
};


// Function to update filters and refetch data
const updateFilters = () => {
    const filters = {
        gender: document.getElementById('genderFilter').value,
        province: document.getElementById('provinceFilter').value,
        bloodGroup: document.getElementById('bloodGroupFilter').value
    };
    fetchDashboardData(filters); // Fetch updated data
};

// Render diagrams based on fetched data
const renderDiagrams = (donations, donors, appointments) => {
    const donationsDiagram = document.getElementById('donationsDiagram');
    const appointmentsDiagram = document.getElementById('appointmentsDiagram');

    donationsDiagram.innerHTML = `<h4 class="font-semibold">Donations by Blood Group</h4>
                                  <canvas id="donationsChart"></canvas>`;
    appointmentsDiagram.innerHTML = `<h4 class="font-semibold">Appointments by Status</h4>
                                      <canvas id="appointmentsChart"></canvas>`;

    // Prepare data for donations chart
    // Count the donations by blood group
    const bloodGroupCounts = donations.reduce((acc, donation) => {
        const bloodGroup = donation.donor.bloodGroup;
        acc[bloodGroup] = (acc[bloodGroup] || 0) + 1;  // Increment the count
        return acc;
    }, {});

    // If you want to ensure all blood groups from the donors are included
    const allBloodGroups = donors.map(donor => donor.bloodGroup);
    const allBloodGroupCounts = allBloodGroups.reduce((acc, bloodGroup) => {
        acc[bloodGroup] = bloodGroupCounts[bloodGroup] || 0;  // Ensure each blood group is counted
        return acc;
    }, {});

    // Prepare data for the chart
    const bloodGroups = Object.keys(allBloodGroupCounts);
    const bloodGroupValues = Object.values(allBloodGroupCounts);

    // Create donations pie chart
    const donationsCtx = document.getElementById('donationsChart').getContext('2d');
    new Chart(donationsCtx, {
        type: 'pie',
        data: {
            labels: bloodGroups,
            datasets: [{
                label: 'Donations by Blood Group',
                data: bloodGroupValues,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF5733', // Add more colors if needed
                ],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Donations by Blood Group',
                },
            },
        },
    });


    // Prepare data for appointments chart
    const appointmentStatusCounts = appointments.reduce((acc, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
    }, {});

    const appointmentStatuses = Object.keys(appointmentStatusCounts);
    const appointmentValues = Object.values(appointmentStatusCounts);

    // Create appointments pie chart
    const appointmentsCtx = document.getElementById('appointmentsChart').getContext('2d');
    new Chart(appointmentsCtx, {
        type: 'pie',
        data: {
            labels: appointmentStatuses,
            datasets: [{
                label: 'Appointments by Status',
                data: appointmentValues,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF5733', // Add more colors if needed
                ],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Appointments by Status',
                },
            },
        },
    });
};


// Render tables based on fetched data
const renderTables = (donors, donations, appointments) => {
    const donorsTableBody = document.getElementById('donorsTableBody');
    const donationsTableBody = document.getElementById('donationsTableBody');
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');

    // Clear previous data
    donorsTableBody.innerHTML = ''; 
    donationsTableBody.innerHTML = ''; 
    appointmentsTableBody.innerHTML = ''; 

    // Render donors table
    donors.forEach((donor, index) => {
        const donorRow = document.createElement('tr');
        donorRow.className = index % 2 === 0 ? "bg-gray-100 hover:bg-blue-100" : "bg-white hover:bg-blue-100";
        donorRow.innerHTML = `
            <td class="p-2">${donor.fullName}</td>
            <td class="p-2">${donor.bloodGroup}</td>
            <td class="p-2">${donor.email}</td>
            <td class="p-2">${donor.province}</td>
            <td class="p-2">${donor.district}</td>
        `;
        donorsTableBody.appendChild(donorRow);
    });

    // Render donations table
    donations.forEach((donation, index) => {
        const donationRow = document.createElement('tr');
        donationRow.className = index % 2 === 0 ? "bg-gray-100 hover:bg-blue-100" : "bg-white hover:bg-blue-100";
        donationRow.innerHTML = `
            <td class="p-2">${donation.donor.fullName}</td>
            <td class="p-2">${donation.donationDate}</td>
            <td class="p-2">${donation.donationCenter.name}</td>
            <td class="p-2">${donation.donor.bloodGroup}</td>
        `;
        donationsTableBody.appendChild(donationRow);
    });

    // Render appointments table
    appointments.forEach((appointment, index) => {
        const appointmentRow = document.createElement('tr');
        appointmentRow.className = index % 2 === 0 ? "bg-gray-100 hover:bg-blue-100" : "bg-white hover:bg-blue-100";
        appointmentRow.innerHTML = `
            <td class="p-2">${appointment.donor.fullName}</td>
            <td class="p-2">${appointment.scheduleDate}</td>
            <td class="p-2">${appointment.center.name}</td>
            <td class="p-2">${appointment.status}</td>
        `;
        appointmentsTableBody.appendChild(appointmentRow);
    });
};

// Show skeleton loading placeholders
const showSkeletons = () => {
    const skeletonTables = ['donorsTableBody', 'donationsTableBody', 'appointmentsTableBody'];
    skeletonTables.forEach(id => {
        const tableBody = document.getElementById(id);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="p-4 animate-pulse bg-gray-100">
                    <div class="skeleton h-8 bg-gray-300 rounded-lg mb-2"></div>
                    <div class="skeleton h-8 bg-gray-300 rounded-lg mb-2"></div>
                    <div class="skeleton h-8 bg-gray-300 rounded-lg"></div>
                </td>
            </tr>
        `;
    });

    const diagrams = ['donationsDiagram', 'appointmentsDiagram'];
    diagrams.forEach(id => {
        const diagram = document.getElementById(id);
        diagram.innerHTML = `
            <div class="skeleton h-32 bg-gray-300 rounded-lg"></div>
        `;
    });
};
