document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translate-btn');
    const translateElement = document.getElementById('google_translate_element');

    // Toggle the visibility of the translate dropdown on click
    translateBtn.addEventListener('click', function() {
        translateElement.classList.toggle('hidden');
    });

    // Hide the translate dropdown if clicking outside of the button or the dropdown
    document.addEventListener('click', function(event) {
        if (!translateBtn.contains(event.target) && !translateElement.contains(event.target)) {
            translateElement.classList.add('hidden');
        }
    });
    // Initialize Google Translate
    googleTranslateElementInit();
});

// Google Translate initialization function
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,sw,rw',
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: false
    }, 'google_translate_element');

    // Remove the default "Sélectionner une langue" option
    setTimeout(function() {
        const selectBox = document.querySelector('.goog-te-combo');
        if (selectBox) {
            selectBox.querySelector('option[value=""]').style.display = 'none';
        }
    }, 1000); // Add delay to ensure the translation element loads
}
