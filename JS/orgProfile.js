document.addEventListener('DOMContentLoaded', async () => {
  try {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
    // ננסה קודם למשוך את האובייקט של הארגון מה־localStorage
    let organization = JSON.parse(localStorage.getItem('organization'));

    // אם אין אובייקט ארגון – ננסה לפי אימייל
    if (!organization) {
      const email = localStorage.getItem('organizationEmail');

      if (!email) {
        alert('עליך להתחבר קודם');
        window.location.href = '/pages/login.html';
        return;
      }

      const response = await fetch('https://handsonserver-new.onrender.com/api/organizations');
      const organizations = await response.json();

      if (!Array.isArray(organizations)) {
        throw new Error('השרת לא החזיר רשימת ארגונים תקינה');
      }

      organization = organizations.find(org =>
        org.email && org.email.toLowerCase() === email.toLowerCase()
      );

      if (!organization) {
        throw new Error('הארגון לא נמצא במסד הנתונים');
      }

      // נשמור אותו ל־localStorage לפעמים הבאות
      localStorage.setItem('organization', JSON.stringify(organization));
    }

=======
>>>>>>> Stashed changes
    const userRole = localStorage.getItem('userRole');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser || userRole !== 'organizer') {
      alert('עליך להתחבר קודם');
      window.location.href = '/pages/login.html';
      return;
    }

    // נקרא לארגון מה־localStorage
    let organization = JSON.parse(loggedInUser);

<<<<<<< Updated upstream
=======
>>>>>>> 643b5532ae5680c4333ae773dd4155584cdf9bb3
>>>>>>> Stashed changes
    // עדכון פרטי הפרופיל בדף
    document.querySelector('.name-box').textContent = organization.organizationName || 'Organization';

    document.querySelectorAll('.info-box')[0].innerHTML = `<strong>Speciality:</strong> ${organization.speciality || '-'}`;
    document.querySelectorAll('.info-box')[1].innerHTML = `<strong>Phone Number:</strong> ${organization.phoneNumber || '-'}`;
    document.querySelectorAll('.info-box')[2].innerHTML = `<strong>Email Address:</strong> ${organization.email || '-'}`;
<<<<<<< Updated upstream

=======
<<<<<<< HEAD
    
=======

>>>>>>> 643b5532ae5680c4333ae773dd4155584cdf9bb3
>>>>>>> Stashed changes
    document.querySelector('.about-box').textContent = organization.about || 'אין תיאור זמין כרגע.';

    // עדכון תמונת פרופיל אם קיימת
    if (organization.profileImage) {
      document.querySelector('.profile-image').src = `https://handsonserver-new.onrender.com/uploads/${organization.profileImage}`;
    }

  } catch (err) {
    console.error('שגיאה בטעינת פרופיל הארגון:', err);
    alert('אירעה שגיאה בטעינת פרטי הארגון');
  }
<<<<<<< Updated upstream
});
=======
<<<<<<< HEAD
});
=======
});
>>>>>>> 643b5532ae5680c4333ae773dd4155584cdf9bb3
>>>>>>> Stashed changes
