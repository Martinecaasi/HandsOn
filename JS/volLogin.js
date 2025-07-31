document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // קבלת ערכים מהטופס
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://handsonserver-new.onrender.com/api/volunteers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // שליחת פרטי התחברות
      });

      const data = await response.json();

      if (response.ok) {
        // שמירת טוקן ותפקיד (לא חובה אם לא משתמשים בזה)
        if (data.token) localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'volunteer');

        alert('התחברת בהצלחה!');

        // ✅ הפניה ישירה לעמוד הבית של מתנדב
        window.location.href = '/volunteer/homePage.html';
      } else {
        alert(data.message || 'פרטי התחברות שגויים');
      }
    } catch (error) {
      console.error('שגיאה בעת התחברות:', error);
      alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
    }
  });
});
