document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');

    if (profileButton) {
        profileButton.addEventListener('click', (e) => {
            e.preventDefault();

            const userRole = localStorage.getItem('userRole');

            if (!userRole) {
                alert('You must be logged in to access your profile.');
                window.location.href = '/Pages/login.html';
                return;
            }

            switch (userRole) {
                case 'volunteer':
                    window.location.href = '/Pages/volunteer/profileVol.html';
                    break;
                case 'organization':
                    window.location.href = '/Pages/organization/orgProfile.html';
                    break;
                case 'admin':
                    window.location.href = '/Pages/admin/profileAdmin.html';
                    break;
                default:
                    alert('Unknown user role. Please log in again.');
                    window.location.href = '/Pages/login.html';
            }
        });
    }
});