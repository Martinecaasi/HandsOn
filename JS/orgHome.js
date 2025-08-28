// בדיקה אם יש משתמש מחובר עם הרשאות מתאימות
document.addEventListener('DOMContentLoaded', async () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');

  if (!loggedInUser || userRole !== 'organizer') {
    window.location.href = '/Pages/login.html';
    return;
  }

  const organizer = JSON.parse(loggedInUser);
  const titleElement = document.querySelector('.title');
  const eventsContainer = document.getElementById('eventsContainer');

  // פונקציה לעיצוב תאריך
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // פונקציה לעיצוב שעה
  function formatTime(timeStr) {
    if (!timeStr) return "Not defined";
    const [hour, minute] = timeStr.split(":");
    return `${hour}:${minute}`;
  }

  // הצגת שם הארגון בכותרת
  const nameToShow = organizer.fullName || organizer.name || organizer.organizationName || 'Organizer';
  if (titleElement) {
    titleElement.textContent = `Welcome, ${nameToShow}! Upcoming Events`;
  }

  // בדיקה שיש מזהה לארגון
  if (!organizer._id) {
    eventsContainer.innerHTML = "<p>You must be logged in as an organization.</p>";
    return;
  }

  // שליפת כל האירועים
  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events');
    const allEvents = await res.json();

    // סינון לפי אירועים שנוצרו ע"י הארגון הנוכחי
    const orgEvents = allEvents.filter(event => event.createdBy?._id === organizer._id);

    if (orgEvents.length === 0) {
      eventsContainer.innerHTML = `
        <p style="text-align: center; margin-top: 60px; font-size: 18px; color: #888;">
          You haven't created any events yet.
        </p>
      `;
    } else {
      orgEvents.forEach(event => {
        const formattedDate = formatDate(event.date);
        const startTime = formatTime(event.time);
        const endTime = formatTime(event.endTime);

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
          <p class="event-name">${event.title}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${startTime}–${endTime}</p>
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