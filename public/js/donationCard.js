

// Fetch data from the API and populate the donation card
async function fetchDonationCardData() {
    try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();
        const responseSessios = await fetch('/api/session'); // Fetch session data from server
        const dataSession = await responseSessios.json();
        

        // Assuming the first user is the current user for demonstration purposes
        const currentUser = dataSession.user; // Adjust as necessary to find the correct user
        const latestDonation = data.donations.find(donation => donation.userId === currentUser.userId);

        // Populate the donation card with fetched data
        document.getElementById('userName').innerText = currentUser.fullName;
        document.getElementById('bloodGroup').innerText = currentUser.bloodGroup;
        document.getElementById('location').innerText = currentUser.province;
        document.getElementById('dateOfBirth').innerText = currentUser.dob;
        document.getElementById('donationDate').innerText = latestDonation.scheduleDate; // Update according to your data structure
        document.getElementById('doctorName').innerText = latestDonation.doctorName; // Update according to your data structure
        document.getElementById('bloodQuantity').innerText = latestDonation.quantity; // Update according to your data structure

        // Generate the barcode using JsBarcode
        JsBarcode("#barcode", latestDonation.donationId, {
            format: "CODE128",
            width: 2,
            height: 40,
            displayValue: true
        });

    } catch (error) {
        console.error('Error fetching donation card data:', error);
    }
}

// Download card functionality
document.getElementById('downloadCard1').addEventListener('click', function() {
    const card = document.querySelector('.flex.justify-center.mt-6');
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'donation_card.png';
        link.click();
    });
});

// Print card functionality
document.getElementById('printCard').addEventListener('click', function() {
    window.print();
});

// Initialize the fetching of donation card data
fetchDonationCardData();
