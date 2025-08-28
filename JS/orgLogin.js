import { loginOrganization } from './api/organizationsApi.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const data = await loginOrganization({ email, password });
      console.log('✅ Login successful:', data);

      // שמירה ב-localStorage
      localStorage.setItem('organizationId', data.organization.id);

      // מעבר לדף הבית של הארגון
      window.location.href = '/pages/organization/orgHome.html';
    } catch (err) {
      alert('❌ Login failed: ' + err.message);
      console.error('Login error:', err);
    }
  });
});