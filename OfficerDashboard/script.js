document.addEventListener('DOMContentLoaded', () => {
    // Navigation handler
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            
            // Hide all sections
            document.querySelectorAll('main section').forEach(section => {
                section.classList.remove('active-section');
            });

            // Show target section
            targetSection.classList.add('active-section');
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        // Implement logout logic
        alert('Logged out successfully');
        // Redirect to login page
        // window.location.href = 'login.html';
    });

    // Simulated data for dashboard
    const totalStudentsEl = document.getElementById('total-students');
    const vacantSeatsEl = document.getElementById('vacant-seats');
    const admittedStudentsEl = document.getElementById('admitted-students');

    // Simulated seat matrix
    const seatMatrixBody = document.getElementById('seat-matrix-body');
    const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

    function initializeSeatMatrix() {
        branches.forEach(branch => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${branch}</td>
                <td>60</td>
                <td>${Math.floor(Math.random() * 30)}</td>
                <td>
                    <button class="btn-secondary">Edit</button>
                </td>
            `;
            seatMatrixBody.appendChild(row);
        });
    }

    // Simulated student admission queue
    const studentNameEl = document.getElementById('student-name');
    const studentRankEl = document.getElementById('student-rank');
    const studentEmailEl = document.getElementById('student-email');
    const admitBtn = document.getElementById('admit-btn');
    const skipBtn = document.getElementById('skip-btn');

    const students = [
        { name: 'Pratham Joya', rank: 1, email: 'pratham@example.com' },
        { name: 'John Doe', rank: 2, email: 'john@example.com' },
        { name: 'Jane Smith', rank: 3, email: 'jane@example.com' }
    ];

    let currentStudentIndex = 0;

    function updateCurrentStudent() {
        if (currentStudentIndex < students.length) {
            const student = students[currentStudentIndex];
            studentNameEl.textContent = student.name;
            studentRankEl.textContent = student.rank;
            studentEmailEl.textContent = student.email;
        } else {
            studentNameEl.textContent = 'No more students';
            studentRankEl.textContent = '-';
            studentEmailEl.textContent = '-';
            admitBtn.disabled = true;
            skipBtn.disabled = true;
        }
    }

    admitBtn.addEventListener('click', () => {
        // Simulate admission process
        currentStudentIndex++;
        updateCurrentStudent();
    });

    skipBtn.addEventListener('click', () => {
        // Simulate skipping student
        currentStudentIndex++;
        updateCurrentStudent();
    });

    // Initialize data
    updateCurrentStudent();
    initializeSeatMatrix();

    // Update dashboard stats
    totalStudentsEl.textContent = students.length;
    vacantSeatsEl.textContent = branches.length * 60 - students.length;
    admittedStudentsEl.textContent = 0;
});