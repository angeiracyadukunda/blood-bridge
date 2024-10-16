document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const idType = document.getElementById('idType').value;
    const idNo = document.getElementById('idNo').value;

    // Validate ID number based on ID type
    if (idType === 'nationalId') {
        const isValidNationalId = /^\d{16}$/.test(idNo); // Check if it's exactly 16 digits
        if (!isValidNationalId) {
            showPopup('National ID must be 16 digits long and contain only numbers.', 'error');
            return; // Stop form submission
        }
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    // console.log(data);
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        showPopup('Registration successful.', 'success');
        setTimeout(() => {
            window.location.href = '/api/registration-success';
        }, 2000);
    } else {
        showPopup(result.message || 'Registration failed', 'error');
    }
});

function showPopup(message, type) {
    const popup = document.querySelector(".alert");
    popup.textContent = message;
    popup.style.backgroundColor = type === "success" ? "green" : "red";
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", 2000);
}
