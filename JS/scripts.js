document.addEventListener('DOMContentLoaded', () => {
  const profileIcon = document.querySelector('.profile-icon');

  if (profileIcon) {
    profileIcon.style.cursor = 'pointer';
    profileIcon.addEventListener('click', () => {
      const userRole = localStorage.getItem('userRole');

      if (!userRole) {
        alert('You must be logged in to access your profile.');
        window.location.href = '/login.html';
        return;
      }

      switch (userRole) {
        case 'volunteer':
          window.location.href = '/Pages/volunteer/profileVol.html';
          break;
        case 'organization':
          window.location.href = '/Pages/organization/profileOrg.html';
          break;
        case 'admin':
          window.location.href = '/Pages/admin/profileAdmin.html';
          break;
        default:
          alert('Unknown user role. Please log in again.');
          window.location.href = '/login.html';
      }
    });
  }
});