// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const logoutBtn = document.getElementById('logout-btn');
const welcomeName = document.getElementById('welcome-name');
const studentName = document.getElementById('student-name');
const markAllReadBtn = document.querySelector('.mark-all-read');
const notifications = document.querySelectorAll('.notification');

// Sample data - In a real app, this would come from an API
const studentData = {
    name: 'Pratham Joya',
    rank: 42,
    queuePosition: 5,
    status: 'Waiting',
    estimatedTime: '2 hrs 30 min'
};

// Initialize the dashboard
function initDashboard() {
    // Update student information
    updateStudentInfo();
    
    // Set up event listeners
    setupEventListeners();
}

// Update student info on the dashboard
function updateStudentInfo() {
    // Update welcome message and user info in navbar
    if(welcomeName) welcomeName.textContent = studentData.name.split(' ')[0];
    if(studentName) studentName.textContent = studentData.name;
    
    // Update dashboard cards
    const rankElement = document.getElementById('current-rank');
    const queueElement = document.getElementById('queue-position');
    const statusElement = document.getElementById('counselling-status');
    const timeElement = document.getElementById('estimated-time');
    
    if(rankElement) rankElement.textContent = studentData.rank;
    if(queueElement) queueElement.textContent = studentData.queuePosition;
    if(statusElement) {
        statusElement.textContent = studentData.status;
        // Add appropriate class based on status
        if(studentData.status === 'Active') {
            statusElement.className = 'highlight status-active';
        } else if(studentData.status === 'Waiting') {
            statusElement.className = 'highlight status-waiting';
        }
    }
    if(timeElement) timeElement.textContent = studentData.estimatedTime;
}

// Set up event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Logout button
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real app, this would call an API to log out
            alert('Logging out...');
            // Redirect to login page
            // window.location.href = 'login.html';
        });
    }
    
    // Mark all notifications as read
    if(markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            notifications.forEach(notification => {
                notification.classList.remove('unread');
            });
        });
    }
    
    // Individual notification click
    notifications.forEach(notification => {
        notification.addEventListener('click', () => {
            notification.classList.remove('unread');
        });
    });
}

// Simulate real-time updates (in a real app, this would use WebSockets or polling)
function simulateRealTimeUpdates() {
    // Update queue position randomly every 30 seconds
    setInterval(() => {
        const queueElement = document.getElementById('queue-position');
        const currentPosition = parseInt(queueElement.textContent);
        
        // Sometimes decrease the position (queue moving forward)
        if(currentPosition > 1 && Math.random() > 0.7) {
            const newPosition = currentPosition - 1;
            queueElement.textContent = newPosition;
            studentData.queuePosition = newPosition;
            
            // Update estimated time
            const timeElement = document.getElementById('estimated-time');
            const newTime = `${newPosition * 30} min`;
            timeElement.textContent = newTime;
            studentData.estimatedTime = newTime;
            
            // Add a notification
            addNotification(`Your position in queue has moved up to ${newPosition}.`);
        }
    }, 30000);
}

// Add a new notification
function addNotification(message) {
    const notificationList = document.getElementById('notifications');
    
    // Create new notification element
    const newNotification = document.createElement('li');
    newNotification.className = 'notification unread';
    
    newNotification.innerHTML = `
        <div class="notification-icon"><i class="fas fa-bell"></i></div>
        <div class="notification-content">
            <p>${message}</p>
            <span class="notification-time">Just now</span>
        </div>
    `;
    
    // Add click event to mark as read
    newNotification.addEventListener('click', () => {
        newNotification.classList.remove('unread');
    });
    
    // Add to the top of the list
    notificationList.insertBefore(newNotification, notificationList.firstChild);
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    simulateRealTimeUpdates();
});