import { loginVolunteer } from '../Api/volunteersApi.js';
import { loginOrganization } from '../Api/organizationsApi.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let isLoggedIn = false;

    // ננסה קודם כמתנדב
    try {
      const data = await loginVolunteer({ email, password });

      if (data?.volunteer?.fullName) {
        localStorage.setItem('volunteerName', data.volunteer.fullName);
        localStorage.setItem('userRole', 'volunteer');
        localStorage.setItem('loggedInUser', JSON.stringify(data.volunteer));
        alert('התחברת בהצלחה כמתנדב!');
        window.location.href = '/pages/volunteer/homePage.html';
        isLoggedIn = true;
        return;
      }
    } catch (err) {
      console.log('Volunteer login failed:', err);
    }

    if (!isLoggedIn) {
      // ננסה כארגון
      try {
        const orgData = await loginOrganization({ email, password });

        console.log('Response from loginOrganization:', orgData);

        if (orgData?.error) {
          alert(orgData.message || 'הסיסמה או האימייל שגויים עבור ארגון');
          return;
        }

        if (orgData?.organization?.name) {
          localStorage.setItem('organizerName', orgData.organization.name);
          localStorage.setItem('userRole', 'organizer');
          localStorage.setItem('loggedInUser', JSON.stringify(orgData.organization));
          alert('התחברת בהצלחה כארגון!');
          window.location.href = '/pages/organizer/homePage.html';
          return;
        }
      } catch (orgErr) {
        console.log('Organization login failed (catch):', orgErr);
        alert('הייתה שגיאה בעת התחברות כארגון');
      }
    }
  });
});