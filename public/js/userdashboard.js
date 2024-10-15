document.addEventListener("DOMContentLoaded", async () => {
    const userInfoTable = document.getElementById("userInfo");
    const appointmentsTable = document.getElementById("appointments");
    const donationsTable = document.getElementById("donations");

     // Retrieve the UID from the server
    const responseSessios = await fetch('/api/session'); // Fetch session data from server
    const dataSession = await responseSessios.json();
    const uid = dataSession.user.uid;
    // Fetch data from the API
    fetch(`/api/admin/dashboard`)
        .then(response => response.json())
        .then(data => {
            const user = data.donors.find(donor => donor.uid === uid);
            const appointments = data.appointments.filter(appointment => appointment.donor.uid === uid);
            const donations = data.donations.filter(donation => donation.donor.uid === uid);

            // Populate User Info Table
            if (user) {
                userInfoTable.innerHTML = `
                    <tr class="bg-gray-100">
                        <td class="border px-4 py-2">${user.fullName}</td>
                        <td class="border px-4 py-2">${user.email}</td>
                        <td class="border px-4 py-2">${user.bloodGroup}</td>
                        <td class="border px-4 py-2">${user.province}</td>
                        <td class="border px-4 py-2">${user.district}</td>
                        <td class="border px-4 py-2">${user.sector}</td>
                    </tr>
                `;
            }

            // Populate Appointments Table
            if (appointments.length > 0) {
                appointmentsTable.innerHTML = appointments.map((appointment, index) => `
                    <tr class="${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
                        <td class="border px-4 py-2">${appointment.scheduleDate}</td>
                        <td class="border px-4 py-2">${appointment.scheduleTime}</td>
                        <td class="border px-4 py-2">${appointment.center.province}</td>
                        <td class="border px-4 py-2">${appointment.center.name}</td>
                    </tr>
                `).join('');
            } else {
                appointmentsTable.innerHTML = `
                    <tr class="bg-gray-100">
                        <td colspan="4" class="border px-4 py-2 text-center">No Appointments</td>
                    </tr>
                `;
            }

            // Populate Donations Table
            if (donations.length > 0) {
                donationsTable.innerHTML = donations.map((donation, index) => `
                    <tr class="${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
                        <td class="border px-4 py-2">${donation.donationDate}</td>
                        <td class="border px-4 py-2">${donation.bloodQuantity} ml</td>
                        <td class="border px-4 py-2">${donation.rhesus}</td>
                        <td class="border px-4 py-2">${donation.donationCenter.name}</td>
                        <td class="border px-4 py-2">${donation.doctorName}</td>
                    </tr>
                `).join('');
            } else {
                donationsTable.innerHTML = `
                    <tr class="bg-gray-100">
                        <td colspan="5" class="border px-4 py-2 text-center">No Donations</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
});
