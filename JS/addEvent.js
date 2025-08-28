const form = document.getElementById('eventForm');
const org = JSON.parse(localStorage.getItem('loggedInUser'));

if (!org || !org._id) {
  alert("You must be logged in as an organization to create an event.");
  window.location.href = '/pages/Organizer/loginOrg.html';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const eventData = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    time: document.getElementById('startTime').value,
    city: document.getElementById('city').value,
    street: document.getElementById('streetName').value,
    buildingNumber: document.getElementById('streetNumber').value,
    contactPhone: document.getElementById('contactPhone').value,
    contactEmail: document.getElementById('contactEmail').value,
    description: document.getElementById('description').value,
    createdBy: org._id,
    createdByModel: "Organization"
  };

  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (!res.ok) throw new Error('Failed to create event');

    alert("Event created successfully!");
    window.location.href = '/pages/Organizer/homePage.html';
  } catch (err) {
    console.error('Error creating event:', err);
    alert("An error occurred while creating the event.");
  }
});