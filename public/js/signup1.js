document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const fullName = document.getElementById('fullName').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    if (password !== confirmPassword) {
        showPopup('Passwords do not match', 'error');
        return;
    }

    // const response = await fetch('/api/signup1', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, fullName, password, role })
    // });

    // const result = await response.json();
    // if (response.ok) {
        // showPopup('Signup successful. Please verify your email.', 'success');
        // if (role === 'donor') {
        //     setTimeout(() => {
        //         window.location.href = `/register?email=${email}&fullName=${fullName}`;
        //     }, 2500);
        // }
    // } else {
    //     showPopup(result.message || 'Signup failed', 'error');
    // }

    fetch('/api/signup1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, password, role })
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
        showPopup('Signup successful. Please verify your email.', 'success');
        if (role === 'donor') {
            setTimeout(() => {
                window.location.href = `/register?email=${email}&fullName=${fullName}`;
            }, 2500);
        } else{
            setTimeout(()=>{
                window.location.href = "api/signup-success"; // Redirect here
            }, 2000);
        }
        // Redirect to the signup success page
    })
    .catch(error => {
        console.error('Error:', error);
        showPopup(error.message || 'An error occurred. Please try again later.', "error");
    });
});

function showPopup(message, type) {
    const popup = document.querySelector(".alert");
    popup.textContent = message;
    popup.style.backgroundColor = type === "success" ? "green" : "red";
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", 2000);
}
