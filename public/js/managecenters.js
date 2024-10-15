document.addEventListener('DOMContentLoaded', () => {
    const centersTableBody = document.getElementById('centersTableBody');
    const centerForm = document.getElementById('donationCenterForm');
    const addCenterBtn = document.getElementById('addCenterBtn');
    const centerIdInput = document.getElementById('centerId');

    // Fetch and display donation centers
    const fetchDonationCenters = async () => {
        try {
            const response = await fetch('/api/donation-centers'); // Endpoint to fetch donation centers
            const centers = await response.json();
            renderCenters(centers);
        } catch (error) {
            console.error('Error fetching donation centers:', error);
        }
    };

    // Render donation centers in the table
    const renderCenters = (centers) => {
        centersTableBody.innerHTML = '';
        centers.forEach((center, index) => {
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'bg-gray-100' : 'bg-white'; // Alternate row colors

            row.innerHTML = `
                <td class="border border-gray-200 px-4 py-2">${center.name}</td>
                <td class="border border-gray-200 px-4 py-2">${center.province}</td>
                <td class="border border-gray-200 px-4 py-2">${center.district}</td>
                <td class="border border-gray-200 px-4 py-2">${center.sector}</td>
                <td class="border border-gray-200 px-4 py-2">${center.contact}</td>
                <td class="border border-gray-200 px-4 py-2">
                    <button class="text-blue-500 hover:underline editBtn" data-id="${center.id}">Edit</button>
                </td>
            `;
            centersTableBody.appendChild(row);
        });

        // Attach event listeners to edit buttons
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', () => {
                const centerId = button.getAttribute('data-id');
                editCenter(centerId);
            });
        });
    };

    // Show form to add/edit center
    addCenterBtn.addEventListener('click', () => {
        centerIdInput.value = ''; // Clear center ID
        centerForm.reset(); // Reset form fields
        document.getElementById('centerForm').classList.toggle('hidden'); // Toggle form visibility
    });

    // Edit a donation center
    const editCenter = async (id) => {
        try {
            const response = await fetch(`/api/donation-centers/${id}`); // Fetch the specific center
            const center = await response.json();

            // Populate the form with center data
            centerIdInput.value = center.id;
            document.getElementById('name').value = center.name;
            document.getElementById('province').value = center.province;
            document.getElementById('district').value = center.district;
            document.getElementById('sector').value = center.sector;
            document.getElementById('contact').value = center.contact;

            document.getElementById('centerForm').classList.remove('hidden'); // Show the form
        } catch (error) {
            console.error('Error fetching center for edit:', error);
        }
    };

    // Handle form submission
    centerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const centerId = centerIdInput.value;
        const centerData = {
            name: document.getElementById('name').value,
            province: document.getElementById('province').value,
            district: document.getElementById('district').value,
            sector: document.getElementById('sector').value,
            contact: document.getElementById('contact').value,
        };
    
        // console.log('Form Data:', centerData); // Debugging: Check the form data
    
        try {
            let response;
    
            if (centerId) {
                // Update existing center
                response = await fetch(`/api/donation-centers/${centerId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(centerData),
                });
            } else {
                // Add new center
                response = await fetch('/api/donation-centers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(centerData),
                });
            }
    
            if (response.ok) {
                fetchDonationCenters(); // Refresh the list after add/update
                document.getElementById('centerForm').classList.add('hidden'); // Hide form
            } else {
                console.error('Failed to save donation center:', response.statusText);
            }
    
        } catch (error) {
            console.error('Error saving donation center:', error);
        }
    });
    // Initial fetch
    fetchDonationCenters();
});