document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId) {
        document.body.innerHTML = "<p>Event not found.</p>";
        return;
    }

    try {
        // שליפת פרטי אירוע בלבד (GET)
        const response = await fetch(`https://handsonserver-new.onrender.com/api/events/${eventId}`);
        const event = await response.json();

        if (!response.ok) {
            document.body.innerHTML = `<p>${event.message}</p>`;
            return;
        }

        // הצגת פרטי האירוע
        document.querySelector(".event-title").textContent = event.title;
        document.querySelector(".event-description").textContent = event.description || "";

        document.querySelector(".event-details").innerHTML = `
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <p><strong>Location:</strong> ${event.city}, ${event.street} ${event.buildingNumber}</p>
      <p><strong>Participants:</strong> ${event.participantCount || 0}</p>
    `;

        // כפתור הרשמה
        document.getElementById("registerBtn").addEventListener("click", async () => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            const userRole = localStorage.getItem("userRole");

            if (!loggedInUser || userRole !== "volunteer") {
                alert("You must be logged in as a volunteer.");
                window.location.href = "/pages/login.html";
                return;
            }

            const res = await fetch(`https://handsonserver-new.onrender.com/api/events/${eventId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: loggedInUser._id })
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = "/pages/volunteer/thanksForReg.html";
            } else {
                alert(data.message || "Error registering.");
            }
        });
    } catch (error) {
        console.error("Error loading event:", error);
        document.body.innerHTML = "<p>Error loading event.</p>";
    }
});