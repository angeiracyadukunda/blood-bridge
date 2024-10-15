document.getElementById('contact-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Prepare data to send
    const data = {
        name,
        email,
        subject,
        message,
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            // Display confirmation message
            const confirmationCard = `
                <div class="bg-gray-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <p><strong>Your Message:</strong></p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong> ${message}</p>
                    <p>Thank you! We have received your message and will get back to you ASAP.</p>
                </div>
            `;
            document.getElementById('confirmation-message').innerHTML = confirmationCard;
            document.getElementById('confirmation-message').classList.remove('hidden');
            document.getElementById('contact-form').reset(); // Reset the form
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending your message. Please try again later.');
    }
});
