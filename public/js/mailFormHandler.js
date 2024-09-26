document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    if (success === 'true') {
        document.querySelector(".alert").style.display = "block";
        setTimeout(() => {
            document.querySelector(".alert").style.display = "none";
        }, 3000);
    }
});