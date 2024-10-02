// Fetch donor details and show in modal
async function showDonorDetails(uid) {
    try {
        const response = await fetch(`/donor-details/${uid}`);
        const donorData = await response.json();
        
        document.getElementById('donor-full-name').textContent = donorData.fullName;
        document.getElementById('donor-email').textContent = donorData.email;
        document.getElementById('donor-gender').textContent = donorData.gender;
        document.getElementById('donor-dob').textContent = donorData.dob;
        document.getElementById('donor-id-type').textContent = donorData.idType;
        document.getElementById('donor-id-no').textContent = donorData.idNo;
        document.getElementById('donor-weight').textContent = donorData.weight;
        document.getElementById('donor-blood-group').textContent = donorData.bloodGroup;
        document.getElementById('donor-province').textContent = donorData.province;
        document.getElementById('donor-district').textContent = donorData.district;
        document.getElementById('donor-sector').textContent = donorData.sector;
        document.getElementById('donor-rewards').textContent = donorData.rewards;
        document.getElementById('donor-bio').textContent = donorData.bio;

        document.getElementById('donor-details-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching donor details:', error);
    }
}

// Close the donor details modal
function closeModal() {
    document.getElementById('donor-details-modal').classList.add('hidden');
}
