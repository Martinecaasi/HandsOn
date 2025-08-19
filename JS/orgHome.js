document.addEventListener('DOMContentLoaded', async () => {
    const org = JSON.parse(localStorage.getItem('loggedInUser'));
    const eventsContainer = document.getElementById('eventsContainer');

    if (!org || !org._id) {
        eventsContainer.innerHTML = "<p>You must be logged in as an organization.</p>";
        return;
    }

    try {
        const res = await fetch('https://handsonserver-new.onrender.com/api/events');
        const allEvents = await res.json();

        const orgEvents = allEvents.filter(event => event.createdBy?._id === org._id);

        if (orgEvents.length === 0) {
            eventsContainer.innerHTML = `
                <p style="text-align: center; margin-top: 60px; font-size: 18px; color: #888;">
                    You haven't created any events yet.
                </p>
            `;
        } else {
            orgEvents.forEach(event => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = `
                    <p class="event-name">${event.title}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>City:</strong> ${event.city}</p>
                    <p><strong>Participants:</strong> ${event.participants?.length || 0}</p>
                `;
                eventsContainer.appendChild(card);
            });
        }
    } catch (err) {
        console.error('Error fetching events:', err);
        eventsContainer.innerHTML = "<p>Error loading events.</p>";
    }
});
