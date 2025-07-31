document.addEventListener('DOMContentLoaded', async () => {
  const email = localStorage.getItem('volunteerEmail');

  if (!email) {
    console.error('לא נמצא אימייל במשתמש המחובר');
    alert('עליך להתחבר קודם');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('https://handsonserver-new.onrender.com/api/volunteers');
    const volunteers = await response.json();

    // הגנה: בדיקה שהתקבלה רשימה תקינה
    if (!Array.isArray(volunteers)) {
      throw new Error('השרת לא החזיר רשימת מתנדבים תקינה');
    }

    // חיפוש מתנדב לפי אימייל תוך בדיקה שהוא קיים
    const volunteer = volunteers.find(v =>
      v.email && v.email.toLowerCase() === email.toLowerCase()
    );

    if (!volunteer) {
      throw new Error('המתנדב לא נמצא במסד הנתונים');
    }

    // עדכון פרטי הפרופיל
    document.querySelector('.name-box').textContent = `${volunteer.fullName}’s Profile`;
    document.querySelectorAll('.info-box')[0].innerHTML = `<strong>Age:</strong> ${calculateAge(volunteer.birthdate)}`;
    document.querySelectorAll('.info-box')[1].innerHTML = `<strong>Phone Number:</strong> ${volunteer.phoneNumber}`;
    document.querySelectorAll('.info-box')[2].innerHTML = `<strong>Email Address:</strong> ${volunteer.email}`;
    document.querySelector('.about-box').textContent = volunteer.aboutMe;

    // אם קיימת תמונת פרופיל – נעדכן
if (volunteer.profileImage) {
          document.querySelector('.profile-image').src = `https://handsonserver-new.onrender.com${volunteer.profileImage}`;
}
  } catch (err) {
    console.error('שגיאה בשליפת נתוני מתנדב:', err);
    alert('אירעה שגיאה בטעינת הפרופיל');
  }
});

// פונקציה לחישוב גיל מהתאריך
function calculateAge(birthdate) {
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}
