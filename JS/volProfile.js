document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ננסה קודם למשוך את האובייקט של המתנדב מה־localStorage
    let volunteer = JSON.parse(localStorage.getItem('volunteer'));

    // אם אין אובייקט מתנדב – ננסה לפי אימייל
    if (!volunteer) {
      const email = localStorage.getItem('volunteerEmail');

      if (!email) {
        alert('עליך להתחבר קודם');
        window.location.href = '/pages/login.html';
        return;
      }

      const response = await fetch('https://handsonserver-new.onrender.com/api/volunteers');
      const volunteers = await response.json();

      if (!Array.isArray(volunteers)) {
        throw new Error('השרת לא החזיר רשימת מתנדבים תקינה');
      }

      volunteer = volunteers.find(v =>
        v.email && v.email.toLowerCase() === email.toLowerCase()
      );

      if (!volunteer) {
        throw new Error('המתנדב לא נמצא במסד הנתונים');
      }

      // נשמור אותו ל־localStorage לפעמים הבאות
      localStorage.setItem('volunteer', JSON.stringify(volunteer));
    }

    // עדכון פרטי הפרופיל בדף
    document.querySelector('.name-box').textContent = `${volunteer.fullName}'s Profile`;
    document.querySelectorAll('.info-box')[0].innerHTML = `<strong>Age:</strong> ${calculateAge(volunteer.birthdate)}`;
    document.querySelectorAll('.info-box')[1].innerHTML = `<strong>Phone Number:</strong> ${volunteer.phoneNumber}`;
    document.querySelectorAll('.info-box')[2].innerHTML = `<strong>Email Address:</strong> ${volunteer.email}`;
    document.querySelector('.about-box').textContent = volunteer.aboutMe;

    // עדכון תמונת פרופיל אם קיימת
    if (volunteer.profileImage) {
      document.querySelector('.profile-image').src = `https://handsonserver-new.onrender.com${volunteer.profileImage}`;
    }
  } catch (err) {
    console.error('שגיאה בטעינת פרופיל:', err);
    alert('אירעה שגיאה בטעינת פרטי המשתמש');
  }
});

// חישוב גיל לפי תאריך לידה
function calculateAge(birthdate) {
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}