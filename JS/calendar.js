const calendar = document.getElementById("calendar");
const selectedDateEl = document.getElementById("selectedDate");
const eventText = document.getElementById("eventText");

// דוגמת אירועים
const events = {
  "2025-07-30": ["Meeting with volunteers", "Check equipment"],
  "2025-07-27": ["Prepare flyers"]
};

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

function renderCalendar() {
  calendar.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay(); // יום ראשון/שני וכו'
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // ימי השבוע
  const weekDays = ["Su","Mo", "Tu", "We", "Th", "Fr", "Sa"];
  weekDays.forEach(day => {
    const div = document.createElement("div");
    div.innerText = day;
    div.style.fontWeight = "bold";
    calendar.appendChild(div);
  });

  // רווחים ריקים לפי היום הראשון
  for (let i = 0; i < (firstDay + 6) % 7; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // ימים בחודש
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.innerText = i;

    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;

    div.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      selectedDateEl.innerText = `${i}/${month + 1}/${year}`;

      if (events[dateStr]) {
        eventText.innerHTML = events[dateStr].map(e => `✔️ ${e}`).join("<br>");
        eventText.style.color = "black";
      } else {
        eventText.innerText = "You Have Zero Events";
        eventText.style.color = "red";
      }
    });

    calendar.appendChild(div);
  }
}

renderCalendar();
