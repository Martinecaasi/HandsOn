import { getAllVolunteers } from "../../Api/volunteersApi.js";
import { getAllOrganizations } from "../../Api/organizationsApi.js";
import { getAllEvents } from "../../Api/eventsApi.js";

const ctx = document.getElementById('statsChart').getContext('2d');

document.addEventListener("DOMContentLoaded", loadStats);

async function loadStats() {
  try {
    // שליפות במקביל
    const [volunteers, organizations, events] = await Promise.all([
      getAllVolunteers(),
      getAllOrganizations(),
      getAllEvents()
    ]);

    const totalVolunteers = volunteers.length;
    const totalOrganizations = organizations.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // מנרמל את היום ל-00:00

    const completedEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;   // אירועים שעברו
    }).length;

    const upcomingEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;  // אירועים עתידיים או היום
    }).length;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Completed Events',
          'Upcoming Events',
          'Total Volunteers',
          'Total Organizations'
        ],
        datasets: [{
          label: 'Stats',
          data: [
            completedEvents,
            upcomingEvents,
            totalVolunteers,
            totalOrganizations
          ],
          backgroundColor: [
            '#cce6ff',
            '#99ccff',
            '#66b3ff',
            '#3399ff'
          ],
          borderRadius: 10,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutBounce'
        }
      }
    });

  } catch (err) {
    console.error("Error loading stats:", err);
  }
}
