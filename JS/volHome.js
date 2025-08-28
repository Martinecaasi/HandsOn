document.addEventListener('DOMContentLoaded', async () => {
  const eventList = document.querySelector('.event-list');
  eventList.innerHTML = '';

  try {
    const response = await fetch('https://handsonserver-new.onrender.com/api/events');
    const events = await response.json();

    if (Array.isArray(events)) {
      events.forEach(event => {
        const dateObj = new Date(event.date);
        const dateStr = dateObj.toLocaleDateString('en-GB'); // תאריך בפורמט DD/MM/YYYY
        const timeStr = event.time || dateObj.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const card = document.createElement('div');
        card.className = 'event-card';

        card.innerHTML = `
          <p><strong>Title:</strong> ${event.title}</p>
          <p><strong>Date & Time:</strong> ${dateStr} | ${timeStr}</p>
          <p><strong>Location:</strong> ${event.street}, ${event.city}</p>
          <p class="more">
            <a href="/pages/volunteer/eventPage.html?id=${event._id}">click Here For More</a>
          </p>
        `;

        eventList.appendChild(card);
      });
    } else {
      eventList.innerHTML = '<p>No events found.</p>';
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    eventList.innerHTML = '<p>There was an error loading events.</p>';
  }
});
