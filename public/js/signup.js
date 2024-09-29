document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("signupForm").addEventListener("submit", submitForm);
});

function submitForm(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;
    const fullName = document.getElementById("fullName").value || "no info";
    // const phoneNumber = document.getElementById("phone-number").value || "no info";
    // const idType = document.getElementById("id-type").value;
    // const idNumber = document.getElementById("id-number").value;
    // const province = document.getElementById("province").value;
    // const fullAddress = document.getElementById("full-address").value || "no info";
    // const preferredLocation = province + ', ' + fullAddress;
    // const dateOfBirth = document.getElementById("date-of-birth").value || null;

    // Check if passwords match
    if (password !== confirmPassword) {
        showPopup("Passwords do not match. Please try again.", "error");
        return;
    }

    const data = {
        email,
        password,
        role,
        fullName,
        // phoneNumber,
        // idType,
        // idNumber,
        // rewards: '0',
        // bloodType: 'no info',
        // preferredLocation,
        // dateOfBirth
    };

    fetch('/api/signup1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(result => {
                throw new Error(result.message + `here in response 1`) ;
            });
        }
        return response.json();
    })
    .then(result => {
        showPopup(result.message, "success");
        // Redirect to the signup success page
        setTimeout(()=>{
            window.location.href = "api/signup-success"; // Redirect here
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        showPopup(error.message || 'An error occurred. Please try again later.', "error");
    });
}

function showPopup(message, type) {
    const popup = document.querySelector(".alert");
    popup.textContent = message;

    if (type === "success") {
        popup.style.backgroundColor = "green";
    } else if (type === "error") {
        popup.style.backgroundColor = "red";
    }

    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}
