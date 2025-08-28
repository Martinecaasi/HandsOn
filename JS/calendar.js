document.addEventListener('DOMContentLoaded', initCalendar);

async function initCalendar() {
  // אלמנטים מה־DOM
  const calendar = document.getElementById("calendar");
  const selectedDateEl = document.getElementById("selectedDate");
  const eventText = document.getElementById("eventText");

  // אימות ארגן מחובר
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');
  if (!loggedInUser || userRole !== 'organizer') {
    window.location.href = '/Pages/login.html';
    return;
  }
  const organizer = JSON.parse(loggedInUser);
  if (!organizer?._id) {
    eventText.textContent = "You must be logged in as an organization.";
    eventText.style.color = "red";
    return;
  }

  // נתוני חודש נוכחי
  const today = new Date();
  const month = today.getMonth();     // 0-11
  const year  = today.getFullYear();

  // עוזר: הפיכת תאריך למפתח YYYY-MM-DD (בלוקאל של המשתמש)
  const toDateKey = (dateLike) => {
    const d = new Date(dateLike);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // שליפת אירועים וסינון לפי הארגון
  let eventsByDate = {}; // { "YYYY-MM-DD": [ {title, _id, ...}, ... ] }
  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events');
    const allEvents = await res.json();

    const myEvents = allEvents.filter(ev => ev?.createdBy?._id === organizer._id);

    // קיבוץ לפי תאריך
    myEvents.forEach(ev => {
      const key = toDateKey(ev.date); // מניח שיש שדה date באירוע
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({
        _id: ev._id,
        title: ev.title || 'Untitled Event',
        time: ev.time || '',   // במידה ויש לך time נפרד
        raw: ev
      });
    });
  } catch (e) {
    console.error('Error fetching events:', e);
    eventText.textContent = "Error loading events.";
    eventText.style.color = "red";
  }

  // רינדור לוח שנה
  renderCalendar({ calendar, selectedDateEl, eventText, eventsByDate, month, year });

  function renderCalendar({ calendar, selectedDateEl, eventText, eventsByDate, month, year }) {
    calendar.innerHTML = "";

    // ימי השבוע
    const weekDays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    weekDays.forEach(day => {
      const div = document.createElement("div");
      div.innerText = day;
      div.className = "weekday-cell";
      calendar.appendChild(div);
    });

    // חישוב רווחים עד היום הראשון (ראשון=0)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < (firstDay + 6) % 7; i++) {
      const pad = document.createElement("div");
      pad.className = "pad-cell";
      calendar.appendChild(pad);
    }

    // ימים
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.classList.add("day");
      cell.textContent = day;

      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // סימון שיש אירועים
      if (eventsByDate[key]?.length) {
        cell.classList.add('has-events');
      }

      cell.addEventListener('click', () => {
        document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        cell.classList.add("selected");

        selectedDateEl.textContent = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

        if (eventsByDate[key]?.length) {
          // מציגים רשימת אירועים
          eventText.style.color = "black";
          eventText.innerHTML = eventsByDate[key]
            .map((ev, idx) => `✔️ ${ev.title}${ev.time ? ` • ${ev.time}` : ''}`)
            .join("<br>");
        } else {
          eventText.style.color = "red";
          eventText.textContent = "You Have Zero Events";
        }
      });

      calendar.appendChild(cell);
    }
  }
}
