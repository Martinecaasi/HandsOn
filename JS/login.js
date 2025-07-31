document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // בדיקה אם מדובר באדמין
    if (email === 'admin@admin.com' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      alert('התחברת כאדמין');
      window.location.href = 'admin/homePage.html'; 
      return;
    }

    try {
      // ניסיון התחברות כמתנדב
      const volunteerRes = await fetch('https://handsonserver-new.onrender.com/api/volunteers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (volunteerRes.ok) {
        const volunteerData = await volunteerRes.json();
        localStorage.setItem('userRole', 'volunteer');
        localStorage.setItem('volunteerEmail', email);
        alert('התחברת כמתנדב');
        window.location.href = 'Pages/volunteer/homePage.html';
        return;
      }

      const orgRes = await fetch('https://handsonserver-new.onrender.com/api/organizations/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (orgRes.ok) {
        const orgData = await orgRes.json();
        localStorage.setItem('userRole', 'organization');
        localStorage.setItem('organizationEmail', email);
        alert('התחברת כמארגן');
        window.location.href = 'organization/homePage.html';
        return;
      }

      // אם נכשל בשני הסוגים
      alert('פרטי התחברות שגויים');

    } catch (error) {
      console.error('שגיאה בעת התחברות:', error);
      alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
    }
  });
});
