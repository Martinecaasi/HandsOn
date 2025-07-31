document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://handsonserver-new.onrender.com/api/volunteers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // שמירה ב־localStorage אם נרצה בעתיד
        localStorage.setItem('volunteerEmail', email);
        alert('התחברת בהצלחה!');
        window.location.href = 'Pages/volunteer/homePage.html';
      } else {
        alert(data.message || 'פרטי התחברות שגויים');
      }
    } catch (error) {
      console.error('שגיאה בעת התחברות:', error);
      alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
    }
  });
});
