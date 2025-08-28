document.addEventListener('DOMContentLoaded', async () => {
  try {
    const userRole = localStorage.getItem('userRole');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser || userRole !== 'organizer') {
      alert('עליך להתחבר קודם');
      window.location.href = '/pages/login.html';
      return;
    }

    const organization = JSON.parse(loggedInUser);

    // מילוי פרטי פרופיל בדף
    document.getElementById('nameBox').textContent = organization.organizationName || 'Organization';
    document.getElementById('specialityBox').textContent = organization.speciality || '-';
    document.getElementById('phoneBox').textContent = organization.phoneNumber || '-';
    document.getElementById('emailBox').textContent = organization.email || '-';
    document.getElementById('aboutBox').textContent = organization.about || 'אין תיאור זמין כרגע.';

    // תמונת פרופיל
    if (organization.profileImage) {
      document.getElementById('profileImage').src =
        `https://handsonserver-new.onrender.com/uploads/${organization.profileImage}`;
    }

  } catch (err) {
    console.error('שגיאה בטעינת פרופיל הארגון:', err);
    alert('אירעה שגיאה בטעינת פרטי הארגון');
  }
});
