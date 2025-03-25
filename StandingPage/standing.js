// Global variables
let currentUser = null;
let userRole = null;

// Sample data
const studentsData = [
    {
        rank: 1,
        name: "Ananya Patel",
        rollNumber: "2023BTECH1015",
        branch: "Computer Science",
        status: "admitted",
        contact: "+91 98712 34567"
    },
    {
        rank: 2,
        name: "Vikram Singh",
        rollNumber: "2023BTECH1022",
        branch: "Computer Science",
        status: "admitted",
        contact: "+91 87654 12309"
    },
    {
        rank: 3,
        name: "Priya Sharma",
        rollNumber: "2023BTECH1008",
        branch: "Electronics",
        status: "admitted",
        contact: "+91 76543 21098"
    },
    {
        rank: 4,
        name: "Amit Kumar",
        rollNumber: "2023BTECH1030",
        branch: "Mechanical",
        status: "admitted",
        contact: "+91 65432 10987"
    },
    {
        rank: 5,
        name: "Sneha Verma",
        rollNumber: "2023BTECH1011",
        branch: "Computer Science",
        status: "skipped",
        contact: "+91 54321 09876"
    },
    {
        rank: 6,
        name: "Harsh Gupta",
        rollNumber: "2023BTECH1007",
        branch: "Electronics",
        status: "admitted",
        contact: "+91 43210 98765"
    },
    {
        rank: 7,
        name: "Neha Reddy",
        rollNumber: "2023BTECH1019",
        branch: "Computer Science",
        status: "admitted",
        contact: "+91 32109 87654"
    },
    {
        rank: 8,
        name: "Arjun Nair",
        rollNumber: "2023BTECH1025",
        branch: "Civil",
        status: "admitted",
        contact: "+91 21098 76543"
    },
    {
        rank: 9,
        name: "Pooja Jain",
        rollNumber: "2023BTECH1033",
        branch: "Computer Science",
        status: "admitted",
        contact: "+91 10987 65432"
    },
    {
        rank: 10,
        name: "Rohan Desai",
        rollNumber: "2023BTECH1017",
        branch: "Mechanical",
        status: "skipped",
        contact: "+91 90876 54321"
    },
    {
        rank: 11,
        name: "Ishita Singh",
        rollNumber: "2023BTECH1042",
        branch: "Electronics",
        status: "admitted",
        contact: "+91 89765 43210"
    },
    {
        rank: 12,
        name: "Aditya Kapoor",
        rollNumber: "2023BTECH1039",
        branch: "Computer Science",
        status: "admitted",
        contact: "+91 78654 32109"
    },
    {
        rank: 13,
        name: "Meera Iyer",
        rollNumber: "2023BTECH1024",
        branch: "Electrical",
        status: "admitted",
        contact: "+91 67543 21098"
    },
    {
        rank: 14,
        name: "Karan Malhotra",
        rollNumber: "2023BTECH1036",
        branch: "Computer Science",
        status: "admitted",
        contact: "+91 56432 10987"
    },
    {
        rank: 15,
        name: "Anita Deshmukh",
        rollNumber: "2023BTECH1028",
        branch: "Electronics",
        status: "admitted",
        contact: "+91 45321 09876"
    },
    {
        rank: 16,
        name: "Rahul Sharma",
        rollNumber: "2023BTECH1001",
        branch: "Computer Science",
        status: "processing",
        contact: "+91 98765 43210"
    }
];

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

function initializeApp() {
    // Check if user is logged in (from localStorage)
    checkLoginStatus();
    
    // Load standings table
    renderStandingsTable();
}

function setupEventListeners() {
    loginLink.addEventListener('click', openLoginModal);
    closeModalBtn.addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    logoutLink.addEventListener('click', handleLogout);
    refreshBtn.addEventListener('click', handleRefresh);
    
    // Admin controls event listeners
    if (processNextBtn) {
        processNextBtn.addEventListener('click', processNextStudent);
    }
    
    if (skipCurrentBtn) {
        skipCurrentBtn.addEventListener('click', skipCurrentStudent);
    }
    
    if (resetQueueBtn) {
        resetQueueBtn.addEventListener('click', resetQueue);
    }
    
    // Close modal when clicking outside
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

function updateUIForLoggedInUser() {
    // Update navigation
    loginLink.classList.add('hidden');
    profileLink.classList.remove('hidden');
    logoutLink.classList.remove('hidden');
    
    // Show/hide sections based on role
    if (userRole === 'student') {
        // Find student data
        const studentData = findStudentByRollOrName(currentUser);
        
        if (studentData) {
            // Display student info
            currentStudentSection.classList.remove('hidden');
            updateStudentInfo(studentData);
        }
    } else if (userRole === 'officer' || userRole === 'admin') {
        // Show admin controls
        adminControls.classList.remove('hidden');
        
        // Show current student being processed
        currentStudentSection.classList.remove('hidden');
        
        // Get the student currently being processed
        const processingStudent = studentsData.find(student => student.status === 'processing');
        if (processingStudent) {
            updateStudentInfo(processingStudent);
        }
    }
}

function findStudentByRollOrName(identifier) {
    return studentsData.find(student => 
        student.rollNumber === identifier || 
        student.name.toLowerCase() === identifier.toLowerCase()
    );
}

function updateStudentInfo(studentData) {
    studentName.textContent = studentData.name;
    studentRoll.textContent = studentData.rollNumber;
    studentRank.textContent = studentData.rank;
    studentBranch.textContent = studentData.branch;
    studentContact.textContent = studentData.contact;
    
    // Update status
    statusText.textContent = capitalizeFirstLetter(studentData.status);
    
    // Update status icon
    statusIcon.className = 'status-icon ' + studentData.status;
    
    // Update icon inside status indicator
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
    
    // Sort students by rank
    const sortedStudents = [...studentsData].sort((a, b) => a.rank - b.rank);
    
    // Display only top 15 students for the table
    const displayStudents = sortedStudents.slice(0, 15);
    
    displayStudents.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="rank-cell">${student.rank}</td>
            <td class="name-cell">${student.name}</td>
            <td>${student.rollNumber}</td>
            <td><span class="branch-badge">${student.branch}</span></td>
            <td><span class="status-badge status-${student.status}">${capitalizeFirstLetter(student.status)}</span></td>
        `;
        
        standingsTableBody.appendChild(row);
    });
}

function openLoginModal(e) {
    e.preventDefault();
    loginModal.classList.remove('hidden');
}

function closeLoginModal() {
    loginModal.classList.add('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // In a real app, you would validate credentials with the server
    // For demo purposes, we'll simulate successful login
    
    // Save user info to localStorage
    const userData = {
        username: username,
        role: userType
    };
    
    localStorage.setItem('clcPortalUser', JSON.stringify(userData));
    
    // Update global variables
    currentUser = username;
    userRole = userType;
    
    // Update UI
    updateUIForLoggedInUser();
    
    // Close modal
    closeLoginModal();
}

function handleLogout(e) {
    e.preventDefault();
    
    // Clear user data from localStorage
    localStorage.removeItem('clcPortalUser');
    
    // Reset global variables
    currentUser = null;
    userRole = null;
    
    // Update UI
    loginLink.classList.remove('hidden');
    profileLink.classList.add('hidden');
    logoutLink.classList.add('hidden');
    currentStudentSection.classList.add('hidden');
    adminControls.classList.add('hidden');
}

function handleRefresh() {
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
    
    // Simulate server request delay
    setTimeout(function() {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        
        // Update the status of a random student
        const statuses = ['admitted', 'waiting', 'skipped', 'processing'];
        const randomIndex = Math.floor(Math.random() * 15);
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Update the student data
        studentsData[randomIndex].status = randomStatus;
        
        // Re-render the table
        renderStandingsTable();
        
        // If user is an admin or officer, update the current student section if needed
        if ((userRole === 'admin' || userRole === 'officer') && randomIndex === studentsData.findIndex(s => s.status === 'processing')) {
            updateStudentInfo(studentsData[randomIndex]);
        }
        
        // Notification
        alert('Standing data has been refreshed!');
    }, 1500);
}

// Admin functions
function processNextStudent() {
    // Find current processing student and set to admitted
    const currentProcessingIndex = studentsData.findIndex(student => student.status === 'processing');
    
    if (currentProcessingIndex !== -1) {
        studentsData[currentProcessingIndex].status = 'admitted';
    }
    
    // Find next student in queue and set to processing
    const nextStudentIndex = studentsData.findIndex((student, index) => 
        index > currentProcessingIndex && 
        student.status !== 'admitted' && 
        student.status !== 'skipped'
    );
    
    if (nextStudentIndex !== -1) {
        studentsData[nextStudentIndex].status = 'processing';
        
        // Update current student display
        updateStudentInfo(studentsData[nextStudentIndex]);
    } else {
        // No more students to process
        alert('All students have been processed or skipped.');
    }
    
    // Update the table
    renderStandingsTable();
}

function skipCurrentStudent() {
    // Find current processing student and set to skipped
    const currentProcessingIndex = studentsData.findIndex(student => student.status === 'processing');
    
    if (currentProcessingIndex !== -1) {
        studentsData[currentProcessingIndex].status = 'skipped';
        
        // Process next student automatically
        processNextStudent();
    } else {
        alert('No student is currently being processed.');
    }
}

function resetQueue() {
    if (confirm('Are you sure you want to reset the entire queue? This action cannot be undone.')) {
        // Reset all students to waiting except admitted ones
        studentsData.forEach(student => {
            if (student.status !== 'admitted') {
                student.status = 'waiting';
            }
        });
        
        // Set the highest ranked waiting student to processing
        const nextStudent = studentsData.find(student => student.status === 'waiting');
        if (nextStudent) {
            nextStudent.status = 'processing';
            updateStudentInfo(nextStudent);
        }
        
        // Update the table
        renderStandingsTable();
        
        alert('Queue has been reset successfully.');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}