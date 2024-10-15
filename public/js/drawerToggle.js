const drawer = document.getElementById('drawer');
const myLinksBtn = document.getElementById('my-links-btn');
const closeDrawer = document.getElementById('close-drawer');

// Toggle drawer with animation
myLinksBtn.addEventListener('click', () => {
    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            drawer.classList.remove('opacity-0', 'scale-95');
            drawer.classList.add('opacity-100', 'scale-100');
        }, 10);  // Slight delay to ensure transition applies after showing
    } else {
        drawer.classList.remove('opacity-100', 'scale-100');
        drawer.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            drawer.classList.add('hidden');
        }, 300);  // Match the duration of the transition (300ms)
    }
});

// Close drawer when "Close" button is clicked
closeDrawer.addEventListener('click', () => {
    drawer.classList.remove('opacity-100', 'scale-100');
    drawer.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        drawer.classList.add('hidden');
    }, 300);  // Match the duration of the transition (300ms)
});

// Close drawer when clicking outside of the drawer
document.addEventListener('click', (event) => {
    // Check if the click happened outside the drawer and it's not the myLinksBtn
    if (!drawer.contains(event.target) && !myLinksBtn.contains(event.target)) {
        if (!drawer.classList.contains('hidden')) {
            drawer.classList.remove('opacity-100', 'scale-100');
            drawer.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                drawer.classList.add('hidden');
            }, 300);  // Match the duration of the transition (300ms)
        }
    }
});
