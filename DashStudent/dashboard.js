document.addEventListener('DOMContentLoaded', () => {
    // Function to check user preferences
    function checkUserPreferences() {
        const hasPreferences = localStorage.getItem('branchPreferences');
        
        if (!hasPreferences) {
            // Redirect to preference form if not filled
            window.location.href = 'branch-preference.html';
        }
    }

    // Function to handle notifications (placeholder)
    function setupNotifications() {
        const notificationIcon = document.querySelector('.notifications');
        
        notificationIcon.addEventListener('click', () => {
            alert('No new notifications');
        });
    }

    // Function to handle user profile dropdown (placeholder)
    function setupUserProfileDropdown() {
        const userProfile = document.querySelector('.user-profile');
        
        userProfile.addEventListener('click', () => {
            alert('User profile dropdown - Coming soon!');
        });
    }

    // Initialize dashboard interactions
    function initDashboard() {
        checkUserPreferences();
        setupNotifications();
        setupUserProfileDropdown();
    }

    // Run dashboard initialization
    initDashboard();
});