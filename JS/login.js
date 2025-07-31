document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // שמירת טוקן ותפקיד
        localStorage.setItem('token', data.token); // אם יש
        localStorage.setItem('role', data.role);   // שמירת תפקיד

        alert('התחברת בהצלחה!');

        // הפניה לפי תפקיד
        switch (data.role) {
          case 'admin':
            window.location.href = '/admin/homePage.html';
            break;
          case 'organizer':
            window.location.href = '/organizer/homePage.html';
            break;
          case 'volunteer':
            window.location.href = '/volunteer/homePage.html';
            break;
          default:
            alert('תפקיד לא מזוהה');
        }
      } else {
        alert(data.message || 'פרטי התחברות שגויים');
      }
    } catch (error) {
      console.error('שגיאה בעת התחברות:', error);
      alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
    }
  });
});
