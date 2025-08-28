document.addEventListener('DOMContentLoaded', async () => {
  try {
    const userRole = localStorage.getItem('userRole');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser || userRole !== 'organizer') {
      alert('עליך להתחבר קודם');
      window.location.href = '/pages/login.html';
      return;
    }

    // נקרא לארגון מה־localStorage
    let organization = JSON.parse(loggedInUser);

    // עדכון פרטי הפרופיל בדף
    document.querySelector('.name-box').textContent = organization.organizationName || 'Organization';

    document.querySelectorAll('.info-box')[0].innerHTML = `<strong>Speciality:</strong> ${organization.speciality || '-'}`;
    document.querySelectorAll('.info-box')[1].innerHTML = `<strong>Phone Number:</strong> ${organization.phoneNumber || '-'}`;
    document.querySelectorAll('.info-box')[2].innerHTML = `<strong>Email Address:</strong> ${organization.email || '-'}`;

    document.querySelector('.about-box').textContent = organization.about || 'אין תיאור זמין כרגע.';

    // עדכון תמונת פרופיל אם קיימת
    if (organization.profileImage) {
      document.querySelector('.profile-image').src = `https://handsonserver-new.onrender.com/uploads/${organization.profileImage}`;
    }

  } catch (err) {
    console.error('שגיאה בטעינת פרופיל הארגון:', err);
    alert('אירעה שגיאה בטעינת פרטי הארגון');
  }
});
