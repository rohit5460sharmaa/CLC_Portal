// Global variables
let currentUser = null;
let userRole = null;

// Student data will now be fetched from API
let studentsData = [];

// DOM elements
const loginLink = document.getElementById('loginLink');
const profileLink = document.getElementById('profileLink');
const logoutLink = document.getElementById('logoutLink');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeModalBtn = document.querySelector('.close');
const currentStudentSection = document.getElementById('currentStudentSection');
const adminControls = document.getElementById('adminControls');
const refreshBtn = document.getElementById('refreshBtn');
const standingsTableBody = document.getElementById('standingsTableBody');

// Student details elements
const studentName = document.getElementById('studentName');
const studentRoll = document.getElementById('studentRoll');
const studentRank = document.getElementById('studentRank');
const studentBranch = document.getElementById('studentBranch');
const studentContact = document.getElementById('studentContact');
const statusText = document.getElementById('statusText');
const statusIcon = document.getElementById('statusIcon');

// Admin control buttons
const processNextBtn = document.getElementById('processNextBtn');
const skipCurrentBtn = document.getElementById('skipCurrentBtn');
const resetQueueBtn = document.getElementById('resetQueueBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    try {
        // Fetch student data
        const [studentsResponse, allocationsResponse] = await Promise.all([
            fetch('http://localhost:8080/api/preferences/all'),
            fetch('http://localhost:8080/api/allocations')
        ]);

        if (!studentsResponse.ok || !allocationsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        studentsData = await studentsResponse.json();
        const allocationsData = await allocationsResponse.json();

        console.log('Allocations Data:', allocationsData);

        // Map allocations by rollNumber for quick lookup
        const allocationMap = new Map(allocationsData.map(allocation => [allocation.rollNumber, allocation]));

        // Update student status and branch based on allocation
        studentsData.forEach(student => {
            const allocation = allocationMap.get(student.rollNumber);
            if (allocation) {
                student.status = 'admitted';
                student.branches = [allocation.branch];
            } else {
                student.status = 'not admitted';
                student.branches = [allocation.branches[0]];

            }
        });

        checkLoginStatus();

        renderStandingsTable();
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Unable to load data. Please try again later.');
    }
}

function setupEventListeners() {
    loginLink.addEventListener('click', openLoginModal);
    closeModalBtn.addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    logoutLink.addEventListener('click', handleLogout);
    refreshBtn.addEventListener('click', handleRefresh);

    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeLoginModal();
        }
    });
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('clcPortalUser');

    if (savedUser) {
        const userData = JSON.parse(savedUser);
        currentUser = userData.username;
        userRole = userData.role;

        updateUIForLoggedInUser();
    }
}

function updateStudentInfo(studentData) {
    studentName.textContent = studentData.studentName || 'N/A';
    studentRoll.textContent = studentData.rollNumber || 'N/A';
    studentRank.textContent = studentData.rank || 'N/A';

    statusText.textContent = capitalizeFirstLetter(studentData.status);

    statusIcon.className = 'status-icon ' + (studentData.status || 'unknown');

    let iconClass = 'fas ';

    switch (studentData.status) {
        case 'admitted':
            iconClass += 'fa-check';
            break;
        case 'processing':
            iconClass += 'fa-sync fa-spin';
            break;
        case 'skipped':
            iconClass += 'fa-times';
            break;
        case 'waiting':
            iconClass += 'fa-clock';
            break;
        default:
            iconClass += 'fa-question';
    }

    statusIcon.innerHTML = `<i class="${iconClass}"></i>`;
}

function renderStandingsTable() {
    standingsTableBody.innerHTML = '';

    const sortedStudents = [...studentsData].sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));

    const displayStudents = sortedStudents.slice(0, 15);

    displayStudents.forEach(student => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="rank-cell">${student.rank || 'N/A'}</td>
            <td class="name-cell">${student.studentName || 'N/A'}</td>
            <td>${student.rollNumber || 'N/A'}</td>
            <td><span class="branch-badge">${student.branches && student.branches[0] ? student.branches[0] : 'N/A'}</span></td>
            <td><span class="status-badge status-${student.status || 'unknown'}">${capitalizeFirstLetter(student.status)}</span></td>
        `;

        standingsTableBody.appendChild(row);
    });
}

// Helper to capitalize first letter safely
function capitalizeFirstLetter(str) {
    if (!str) return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1);
} 

// Placeholder functions for login/logout/modal
function openLoginModal() {
    loginModal.style.display = 'block';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    alert('Login functionality not implemented yet.');
}

function handleLogout() {
    localStorage.removeItem('clcPortalUser');
    location.reload();
}

function handleRefresh() {
    initializeApp();
} 

function updateUIForLoggedInUser() {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'block';

    if (userRole === 'admin') {
        adminControls.style.display = 'block';
    } else {
        adminControls.style.display = 'none';
    }
}
