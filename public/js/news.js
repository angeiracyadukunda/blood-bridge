document.addEventListener("DOMContentLoaded", async () => {
    const loadingSkeleton = document.getElementById('loadingSkeleton');
    const latestNewsSection = document.getElementById('latestNewsSection');
    const upcomingEventsSection = document.getElementById('upcomingEventsSection');
    const successStoriesSection = document.getElementById('successStoriesSection');
    const eventHighlightsSection = document.getElementById('eventHighlightsSection');

    try {
        const response = await fetch('/api/show/announcements');
        const data = await response.json();

        if (response.ok) {
            // Hide loading skeleton once data is fetched
            loadingSkeleton.style.display = 'none';

            // Display and populate the "Latest News" section
            latestNewsSection.classList.remove('hidden');
            const latestNewsContainer = document.getElementById('latestNews');
            data.latestNews.forEach((news, index) => {
                latestNewsContainer.innerHTML += `
                    <article class="bg-white p-4 rounded shadow">
                        <h3 class="text-xl font-bold text-gray-800">${news.announcementTitle}</h3>
                        <p class="text-gray-600">${news.announcementBody}</p>
                        <p class="text-sm text-gray-500"><strong>Date:</strong> ${new Date(news.announcementDate).toLocaleDateString()}</p>
                    </article>
                    ${index < data.latestNews.length - 1 ? '<hr class="my-6 border-gray-300">' : ''}
                `;
            });

            // Display and populate the "Upcoming Events" section
            upcomingEventsSection.classList.remove('hidden');
            const upcomingEventsContainer = document.getElementById('upcomingEvents');
            data.upcomingEvents.forEach((event, index) => {
                upcomingEventsContainer.innerHTML += `
                    <li class="bg-white p-4 rounded shadow">
                        <h3 class="text-xl font-bold text-gray-800">${event.announcementTitle}</h3>
                        <p class="text-gray-600"><strong>Date:</strong> ${new Date(event.announcementDate).toLocaleDateString()}</p>
                        <p class="text-gray-600"><strong>Location:</strong> ${event.announcementLocation}</p>
                        <p class="text-gray-600">${event.announcementBody}</p>
                    </li>
                    ${index < data.upcomingEvents.length - 1 ? '<hr class="my-6 border-gray-300">' : ''}
                `;
            });

            // Display and populate the "Success Stories" section
            successStoriesSection.classList.remove('hidden');
            const successStoriesContainer = document.getElementById('successStories');
            data.successStories.forEach((story, index) => {
                successStoriesContainer.innerHTML += `
                    <article class="bg-white p-4 rounded shadow">
                        <h3 class="text-xl font-bold text-gray-800">${story.announcementTitle}</h3>
                        <p class="text-gray-600">${story.announcementBody}</p>
                    </article>
                    ${index < data.successStories.length - 1 ? '<hr class="my-6 border-gray-300">' : ''}
                `;
            });

            // Display and populate the "Event Highlights" section
            eventHighlightsSection.classList.remove('hidden');
            const eventHighlightsContainer = document.getElementById('eventHighlights');
            data.eventHighlights.forEach((highlight, index) => {
                eventHighlightsContainer.innerHTML += `
                    <div class="bg-white p-4 rounded shadow">
                        <h3 class="text-xl font-bold text-gray-800">${highlight.announcementTitle}</h3>
                        <p class="text-gray-600">${highlight.announcementBody}</p>
                    </div>
                    ${index < data.eventHighlights.length - 1 ? '<hr class="my-6 border-gray-300">' : ''}
                `;
            });
        }
    } catch (error) {
        console.error('Error fetching announcements:', error);
        loadingSkeleton.innerHTML = `<p class="text-red-500">Failed to load announcements. Please try again later.</p>`;
    }
});
