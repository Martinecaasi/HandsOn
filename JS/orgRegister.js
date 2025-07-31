// orgRegister.js – הרשמה של ארגון חדש במערכת Hands On
document.addEventListener('DOMContentLoaded', () => {
    // --- תצוגה מקדימה של תמונת פרופיל ---
    const input = document.getElementById('orgImageInput');
    const preview = document.getElementById('orgAvatarPreview');

    input.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // --- התאמת גובה אוטומטית לטקסטאראה ---
    const textarea = document.querySelector('.signup-form textarea');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    // --- טעינת ערים מהשרת שלך ---
    async function loadCities() {
        const citySelect = document.getElementById("citySelect");

        try {
            const response = await fetch('https://handsonserver.onrender.com/api/cities');
            const cities = await response.json();

            citySelect.innerHTML = '<option value="">בחר עיר</option>';
            cities.forEach(city => {
                const option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } catch (error) {
            console.error("שגיאה בטעינת ערים:", error);
            citySelect.innerHTML = '<option value="">שגיאה בטעינה</option>';
        }
    }

    loadCities(); // קריאה לטעינת ערים מהשרת

    // --- שליחת הטופס ---
    const form = document.querySelector('.signup-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // הוספת שדות לטופס
        formData.append('orgName', document.getElementById('orgName').value);
        formData.append('phoneNumber', document.getElementById('phone').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('streetName', document.getElementById('streetName').value);
        formData.append('streetNumber', document.getElementById('streetNumber').value);
        formData.append('apartmentNumber', document.getElementById('apartmentNumber').value);
        formData.append('apartmentFloor', document.getElementById('apartmentFloor').value);
        formData.append('city', document.getElementById('citySelect').value);
        formData.append('about', document.getElementById('about').value);

        // בדיקת עיר חובה
        if (!formData.get("city")) {
            alert("יש לבחור עיר מהרשימה.");
            return;
        }

        // תמונת פרופיל – חייב להישלח בשם "profileImage"
        const imageFile = document.getElementById('orgImageInput').files[0];
        if (imageFile) {
            formData.append('profileImage', imageFile);
        }

        try {
            const response = await fetch('https://handsonserver.onrender.com/api/organizations', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('הארגון נרשם בהצלחה!');
                window.location.href = '/login.html';
            } else {
                alert(data.message || 'שגיאה בהרשמה');
            }
        } catch (error) {
            console.error('שגיאה בשליחת הטופס:', error);
            alert('אירעה שגיאה, נסה שוב מאוחר יותר.');
        }
    });
});
