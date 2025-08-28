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

    // מילוי פרטי הפרופיל בדף
    document.querySelector('.name-box').textContent = `${volunteer.fullName}'s Profile`;
    document.querySelectorAll('.info-box')[0].innerHTML = `<strong>Age:</strong> ${calculateAge(volunteer.birthdate)}`;
    document.querySelectorAll('.info-box')[1].innerHTML = `<strong>Phone Number:</strong> ${volunteer.phoneNumber}`;
    document.querySelectorAll('.info-box')[2].innerHTML = `<strong>Email Address:</strong> ${volunteer.email}`;
    document.querySelector('.about-box').textContent = volunteer.aboutMe || 'No description yet.';

    // תמונת פרופיל
    if (volunteer.profileImage) {
      document.querySelector('.profile-image').src =
        `https://handsonserver-new.onrender.com/uploads/${volunteer.profileImage}`;
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
