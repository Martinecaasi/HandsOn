document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://handsonserver-new.onrender.com/api/volunteers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // שמירת שם (אם קיים)
        if (data.volunteer?.fullName) {
          localStorage.setItem('volunteerName', data.volunteer.fullName);
        }

        alert('התחברת בהצלחה!');
        window.location.assign('/volunteer/homePage.html');
      } else {
        alert(data.message || 'פרטי התחברות שגויים');
      }
    } catch (error) {
      console.error('שגיאה בעת התחברות:', error);
      alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
    }
  });
});
