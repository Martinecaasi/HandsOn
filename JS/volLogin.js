import { loginVolunteer } from '../Api/volunteersApi.js';
import { loginOrganization } from '../Api/organizationsApi.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream

    const email = document.getElementById('email').value.toLowerCase().trim();
=======
    const email = document.getElementById('email').value.trim();
>>>>>>> Stashed changes
    const password = document.getElementById('password').value;

    // ננסה קודם כמתנדב
    try {
      const data = await loginVolunteer({ email, password });

      if (data.volunteer?.fullName) {
        localStorage.setItem('volunteerName', data.volunteer.fullName);
        localStorage.setItem('userRole', 'volunteer');
        localStorage.setItem('loggedInUser', JSON.stringify(data.volunteer));
        alert('התחברת בהצלחה כמתנדב!');
        window.location.href = '/pages/volunteer/homePage.html';
        return;
      } else if (data.message) {
        // יש מתנדב כזה אבל הסיסמה או המייל לא נכון
        alert('יש מתנדב כזה אבל הסיסמה או המייל לא נכון');
        return;
      }
    } catch (volError) {
      // אם לא קיים מתנדב, ננסה כארגון
      try {
        const orgData = await loginOrganization({ email, password });

        if (orgData.organizer?.fullName) {
          localStorage.setItem('organizerName', orgData.organizer.fullName);
          localStorage.setItem('userRole', 'organizer');
          localStorage.setItem('loggedInUser', JSON.stringify(orgData.organizer));
          alert('התחברת בהצלחה כארגון!');
          window.location.href = '/pages/organizer/homePage.html';
          return;
        } else if (orgData.message) {
          // יש ארגון כזה אבל הסיסמה או המייל לא נכון
          alert('יש ארגון כזה אבל הסיסמה או המייל לא נכון');
          return;
        }
      } catch (orgError) {
        // לא נמצא מתנדב ולא ארגון
        alert('לא נמצא משתמש עם המייל הזה');
      }
    }
  });
});