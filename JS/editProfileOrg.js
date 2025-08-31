// קובץ editOrgProfile.js
// לוגיקה לעריכת פרופיל ארגון קיים

const API_URL = "https://your-server.com/api/organizations"; // לשנות לכתובת השרת שלך
const orgId = localStorage.getItem("orgId"); 
// שומר את ה-id בלוקאל סטורג' אחרי login/register

// אלמנטים מהטופס
const form = document.getElementById("editOrgForm");
const avatarPreview = document.getElementById("orgAvatarPreview");
const avatarInput = document.getElementById("orgImageInput");

const orgNameInput = document.getElementById("orgName");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const streetNameInput = document.getElementById("streetName");
const streetNumberInput = document.getElementById("streetNumber");
const apartmentNumberInput = document.getElementById("apartmentNumber");
const apartmentFloorInput = document.getElementById("apartmentFloor");
const citySelect = document.getElementById("citySelect");
const aboutInput = document.getElementById("aboutOrg");

// --- טעינת נתוני הארגון ---
async function loadOrganizationData() {
  try {
    const res = await fetch(`${API_URL}/${orgId}`);
    if (!res.ok) throw new Error("שגיאה בטעינת נתוני הארגון");

    const org = await res.json();

    // מילוי השדות
    orgNameInput.value = org.name || "";
    phoneInput.value = org.phoneNumber || "";
    emailInput.value = org.email || "";
    streetNameInput.value = org.address?.streetName || "";
    streetNumberInput.value = org.address?.streetNumber || "";
    apartmentNumberInput.value = org.address?.apartmentNumber || "";
    apartmentFloorInput.value = org.address?.apartmentFloor || "";
    aboutInput.value = org.about || "";

    // בחירת העיר
    if (org.city) {
      let option = [...citySelect.options].find(opt => opt.value === org.city);
      if (option) option.selected = true;
      else {
        const newOption = new Option(org.city, org.city, true, true);
        citySelect.appendChild(newOption);
      }
    }

    // תמונת פרופיל אם קיימת
    if (org.imageUrl) {
      avatarPreview.src = org.imageUrl;
    }
  } catch (err) {
    console.error(err.message);
    alert("שגיאה בטעינת הנתונים");
  }
}

// --- Preview לתמונה שנבחרה ---
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

// --- שליחת טופס עדכון ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", orgNameInput.value);
  formData.append("phoneNumber", phoneInput.value);
  formData.append("email", emailInput.value);
  formData.append("streetName", streetNameInput.value);
  formData.append("streetNumber", streetNumberInput.value);
  formData.append("apartmentNumber", apartmentNumberInput.value);
  formData.append("apartmentFloor", apartmentFloorInput.value);
  formData.append("city", citySelect.value);
  formData.append("about", aboutInput.value);

  if (avatarInput.files[0]) {
    formData.append("image", avatarInput.files[0]);
  }

  try {
    const res = await fetch(`${API_URL}/${orgId}`, {
      method: "PUT",
      body: formData
    });

    if (!res.ok) throw new Error("שגיאה בעדכון הארגון");

    const data = await res.json();
    alert("הפרטים עודכנו בהצלחה!");
    window.location.href = "/Pages/Organizer/orgProfile.html"; // חזרה לפרופיל
  } catch (err) {
    console.error(err.message);
    alert("עדכון נכשל");
  }
});

// טעינה ראשונית
loadOrganizationData();
