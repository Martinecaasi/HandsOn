document.addEventListener('DOMContentLoaded', async () => {
  try {
    const userRole = localStorage.getItem('userRole');
    const loggedInUser = localStorage.getItem('loggedInUser');

    // בדיקה האם המשתמש הוא מתנדב
    if (!loggedInUser || userRole !== 'volunteer') {
      alert('עליך להתחבר קודם');
      window.location.href = '/pages/login.html';
      return;
    }

    let volunteer = JSON.parse(loggedInUser);

    // שלב חשוב: אם חסרים שדות, נביא את כל הנתונים מהשרת לפי ה־id
    const id = volunteer._id || volunteer.id;
    if (!volunteer.birthdate || !volunteer.phoneNumber || volunteer.aboutMe === undefined) {
      const res = await fetch(`https://handsonserver-new.onrender.com/api/volunteers/${id}`);
      if (res.ok) {
        volunteer = await res.json();
        localStorage.setItem('loggedInUser', JSON.stringify(volunteer)); // נשמור את הגרסה המלאה
      }
    }

    // מילוי פרטי הפרופיל בדף
    document.querySelector('.name-box').textContent = `${volunteer.fullName || 'Volunteer'}'s Profile`;
    document.querySelectorAll('.info-box')[0].innerHTML = `<strong>Age:</strong> ${calculateAge(volunteer.birthdate)}`;
    document.querySelectorAll('.info-box')[1].innerHTML = `<strong>Phone Number:</strong> ${volunteer.phoneNumber || '-'}`;
    document.querySelectorAll('.info-box')[2].innerHTML = `<strong>Email Address:</strong> ${volunteer.email || '-'}`;
    document.querySelector('.about-box').textContent = volunteer.aboutMe?.trim() || 'No description yet.';

    // תמונת פרופיל
    if (volunteer.profileImage) {
      const src = volunteer.profileImage.startsWith('/uploads')
        ? `https://handsonserver-new.onrender.com${volunteer.profileImage}`
        : `https://handsonserver-new.onrender.com/uploads/${volunteer.profileImage}`;
      document.querySelector('.profile-image').src = src;
    }

  } catch (err) {
    console.error('שגיאה בטעינת פרופיל:', err);
    alert('אירעה שגיאה בטעינת פרטי המשתמש');
  }
});

// חישוב גיל לפי תאריך לידה
function calculateAge(birthdate) {
  if (!birthdate) return '-';
  const dob = new Date(birthdate);
  if (isNaN(dob.getTime())) return '-';
  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}