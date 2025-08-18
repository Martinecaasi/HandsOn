document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (!loginForm) {
    console.error('Element with id="loginForm" not found in the page!');
    return;
  }

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
        if (data.volunteer?.fullName) {
          localStorage.setItem('volunteerName', data.volunteer.fullName);
        }

        localStorage.setItem('userRole', 'volunteer');
        localStorage.setItem('volunteer', JSON.stringify(data.volunteer)); // ✅ הוספנו

        alert('Login successful!');
        window.location.href = '/pages/volunteer/homePage.html';
      }
      else {
        alert(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});