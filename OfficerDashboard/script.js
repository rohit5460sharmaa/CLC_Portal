document.addEventListener('DOMContentLoaded', function() {
    const branchSeatForm = document.getElementById('branch-seat-form');
    const seatMatrixBody = document.getElementById('seat-matrix-body');
    const editModal = document.getElementById('edit-modal');
    const editSeatForm = document.getElementById('edit-seat-form');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // Navigation links
    const dashboardLink = document.getElementById('dashboard-link');
    const seatManagementLink = document.getElementById('seat-management-link');
    const seatMatrixLink = document.getElementById('seat-matrix-link');

    const studentQueueLink = document.getElementById('student-queue-link');
    const reportsLink = document.getElementById('reports-link');

    // Sections
    const sections = document.querySelectorAll('.section');

    // Navigation event listeners
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    }

    dashboardLink.addEventListener('click', () => showSection('dashboard'));
    seatManagementLink.addEventListener('click', () => showSection('seat-management'));
    seatMatrixLink.addEventListener('click', () => showSection('seat-matrix'));

    studentQueueLink.addEventListener('click', () => showSection('student-queue'));
    reportsLink.addEventListener('click', () => showSection('reports'));

    // Base URLs for backend APIs
    const BASE_URLS = {
        seats: 'http://localhost:8080/api/seats',
        preferences: 'http://localhost:8080/api/preferences',
        allocation: 'http://localhost:8080/api/allocations',
        students: 'http://localhost:8080/students'
        
    };

    // Seat Management Functionality
    // Function to fetch branches from backend
    async function fetchBranches() {
        try {
            const response = await fetch(BASE_URLS.seats);
            const branches = await response.json();
            
            // Clear existing rows
            seatMatrixBody.innerHTML = '';

            // Populate table with fetched branches
            branches.forEach(branch => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2">${branch.branch}</td>
                    <td class="px-4 py-2">${branch.generalSeats + branch.scSeats + branch.stSeats + branch.obcSeats}</td>
                    <td class="px-4 py-2">${branch.generalSeats}</td>
                    <td class="px-4 py-2">${branch.scSeats}</td>
                    <td class="px-4 py-2">${branch.stSeats}</td>
                    <td class="px-4 py-2">${branch.obcSeats}</td>
                    <td class="px-4 py-2 space-x-2">
                        <button onclick="editBranch(${branch.id}, '${branch.branch}', ${branch.generalSeats}, ${branch.scSeats}, ${branch.stSeats}, ${branch.obcSeats})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteBranch(${branch.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                seatMatrixBody.appendChild(row);
            });

            // Update dashboard statistics
            updateDashboardStats(branches);
            updateReports(branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
            alert('Failed to fetch branches');
        }
    }

    // Function to update dashboard statistics
    function updateDashboardStats(branches) {
        const totalSeats = branches.reduce((sum, branch) => 
            sum + branch.generalSeats + branch.scSeats + branch.stSeats + branch.obcSeats, 0);
        const admittedStudents = branches.reduce((sum, branch) => 
            sum + branch.filledGeneralSeats + branch.filledScSeats + branch.filledStSeats + branch.filledObcSeats, 0);
        
        document.getElementById('total-students').textContent = totalSeats;
        document.getElementById('vacant-seats').textContent = totalSeats - admittedStudents;
        document.getElementById('admitted-students').textContent = admittedStudents;
    }

    // Function to update reports charts
    function updateReports(branches) {
        // Seat Occupancy Chart
        const seatOccupancyCtx = document.getElementById('seat-occupancy-chart').getContext('2d');
        new Chart(seatOccupancyCtx, {
            type: 'pie',
            data: {
                labels: branches.map(b => b.branch),
                datasets: [{
                    label: 'Seat Occupancy',
                    data: branches.map(b => b.generalSeats + b.scSeats + b.stSeats + b.obcSeats),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ]
                }]
            }
        });

        // Category-wise Admission Chart
        const categoryAdmissionCtx = document.getElementById('category-admission-chart').getContext('2d');
        new Chart(categoryAdmissionCtx, {
            type: 'bar',
            data: {
                labels: ['General', 'SC', 'ST', 'OBC'],
                datasets: [{
                    label: 'Seats',
                    data: [
                        branches.reduce((sum, b) => sum + b.generalSeats, 0),
                        branches.reduce((sum, b) => sum + b.scSeats, 0),
                        branches.reduce((sum, b) => sum + b.stSeats, 0),
                        branches.reduce((sum, b) => sum + b.obcSeats, 0)
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ]
                }]
            }
        });
    }

    // Function to add a new branch
    async function addBranch(e) {
        e.preventDefault();
        
        // Collect form data
        const branchData = {
            branch: document.getElementById('branch-name').value,
            generalSeats: parseInt(document.getElementById('gen-seats').value || 0),
            scSeats: parseInt(document.getElementById('sc-seats').value || 0),
            stSeats: parseInt(document.getElementById('st-seats').value || 0),
            obcSeats: parseInt(document.getElementById('obc-seats').value || 0),
            filledGeneralSeats: 0,
            filledScSeats: 0,
            filledStSeats: 0,
            filledObcSeats: 0
        };

        try {
            const response = await fetch(BASE_URLS.seats, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(branchData)
            });

            if (!response.ok) {
                throw new Error('Failed to add branch');
            }

            // Refresh the branch list
            fetchBranches();

            // Reset form
            branchSeatForm.reset();
        } catch (error) {
            console.error('Error adding branch:', error);
            alert('Failed to add branch');
        }
    }

    // Function to delete a branch
    async function deleteBranch(id) {
        try {
            const response = await fetch(`${BASE_URLS.seats}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete branch');
            }

            // Refresh the branch list
            fetchBranches();
        } catch (error) {
            console.error('Error deleting branch:', error);
            alert('Failed to delete branch');
        }
    }

    // Function to edit a branch
    function editBranch(id, branch, genSeats, scSeats, stSeats, obcSeats) {
        // Populate edit modal
        document.getElementById('edit-seat-id').value = id;
        document.getElementById('edit-branch-name').value = branch;
        document.getElementById('edit-gen-seats').value = genSeats;
        document.getElementById('edit-sc-seats').value = scSeats;
        document.getElementById('edit-st-seats').value = stSeats;
        document.getElementById('edit-obc-seats').value = obcSeats;

        // Show edit modal
        editModal.classList.remove('hidden');
        editModal.classList.add('flex');
    }

    // Function to update a branch
    async function updateBranch(e) {
        e.preventDefault();

        const id = document.getElementById('edit-seat-id').value;
        const branchData = {
            branch: document.getElementById('edit-branch-name').value,
            generalSeats: parseInt(document.getElementById('edit-gen-seats').value || 0),
            scSeats: parseInt(document.getElementById('edit-sc-seats').value || 0),
            stSeats: parseInt(document.getElementById('edit-st-seats').value || 0),
            obcSeats: parseInt(document.getElementById('edit-obc-seats').value || 0),
            filledGeneralSeats: 0,
            filledScSeats: 0,
            filledStSeats: 0,
            filledObcSeats: 0
        };

        try {
            const response = await fetch(`${BASE_URLS.seats}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(branchData)
            });

            if (!response.ok) {
                throw new Error('Failed to update branch');
            }

            // Close modal and refresh list
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
            fetchBranches();
        } catch (error) {
            console.error('Error updating branch:', error);
            alert('Failed to update branch');
        }
    }

    // Student Admission Queue Functionality
    // DOM Elements for Student Queue
    const currentStudentSection = {
        name: document.getElementById('student-name'),
        rank: document.getElementById('student-rank'),
        category: document.getElementById('student-category'),
        branchesDropdown: document.getElementById('preferred-branches-dropdown'),
        admitBtn: document.getElementById('admit-btn'),
        skipBtn: document.getElementById('skip-btn')
    };

    // State variables
    let currentStudentPreferences = null;
    let studentQueue = [];

    // Fetch student preferences
    async function fetchStudentPreferences() {
        try {
            const response = await fetch(`${BASE_URLS.preferences}/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            studentQueue = await response.json();
            
            // Sort students by rank
            studentQueue.sort((a, b) => a.rank - b.rank);

            // Load first student in queue
            if (studentQueue.length > 0) {
                loadNextStudent();
            } else {
                clearCurrentStudent();
                alert('No students in the admission queue.');
            }
        } catch (error) {
            console.error('Error fetching student preferences:', error);
            alert(`Failed to fetch student preferences: ${error.message}`);
        }
    }

    // Load next student in queue
    function loadNextStudent() {
        if (studentQueue.length === 0) {
            clearCurrentStudent();
            alert('No more students in the admission queue.');
            return;
        }

        currentStudentPreferences = studentQueue[0];

        // Update current student display
        currentStudentSection.name.textContent = currentStudentPreferences.studentName || 'N/A';
        currentStudentSection.rank.textContent = currentStudentPreferences.rank || 'N/A';
        currentStudentSection.category.textContent = currentStudentPreferences.category || 'N/A';

        // Populate branch dropdown
        populateBranchDropdown(currentStudentPreferences.branches);
    }

    // Populate branch dropdown
    function populateBranchDropdown(branches) {
        // Clear existing options
        currentStudentSection.branchesDropdown.innerHTML = '';

        if (!branches || branches.length === 0) {
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'No branches available';
            defaultOption.value = '';
            currentStudentSection.branchesDropdown.appendChild(defaultOption);
            return;
        }

        // Add default prompt
        const promptOption = document.createElement('option');
        promptOption.textContent = 'Select a Branch';
        promptOption.value = '';
        promptOption.disabled = true;
        promptOption.selected = true;
        currentStudentSection.branchesDropdown.appendChild(promptOption);

        // Add branch options
        branches.forEach((branch, index) => {
            const option = document.createElement('option');
            option.value = branch;
            option.textContent = `${index + 1}. ${branch}`;
            currentStudentSection.branchesDropdown.appendChild(option);
        });
    }

    // Clear current student display
    function clearCurrentStudent() {
        Object.values(currentStudentSection).forEach(element => {
            if (element) {
                if (element === currentStudentSection.branchesDropdown) {
                    element.innerHTML = ''; // Clear dropdown
                } else if (element !== currentStudentSection.admitBtn && element !== currentStudentSection.skipBtn) {
                    element.textContent = '-';
                }
            }
        });
    }

   // Admit student function
     // Admit student function
     async function admitStudent() {
        if (!currentStudentPreferences) return;
    
        // Get selected branch
        const selectedBranch = currentStudentSection.branchesDropdown.value;
    
        if (!selectedBranch) {
            alert('Please select a branch');
            return;
        }
    
        try {
            // Check if student is already allocated
            const checkAllocationResponse = await fetch(`${BASE_URLS.allocation}/${currentStudentPreferences.rollNumber}`);
    
            if (checkAllocationResponse.ok) {
                alert('Student is already allocated.');
                return;
            }
    
            // Prepare student allocation data
            const studentAllocation = {
                rollNumber: currentStudentPreferences.rollNumber,
                studentName: currentStudentPreferences.studentName,
                category: currentStudentPreferences.category,
                rank: currentStudentPreferences.rank,
                branch: selectedBranch
            };
    
            // Proceed with allocation and send data to backend
            const allocationResponse = await fetch(`${BASE_URLS.allocation}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentAllocation)
            });
    
            if (!allocationResponse.ok) {
                const errorText = await allocationResponse.text();
                throw new Error(errorText || 'Allocation failed');
            }
    
            // Update isAdmitted field in student table
            const updateStudentResponse = await fetch(`${BASE_URLS.students}/${currentStudentPreferences.rollNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({admitted: true })
            });
    
            if (!updateStudentResponse.ok) {
                const errorText = await updateStudentResponse.text();
                console.warn('Failed to update student admission status:', errorText);
            }
            
    
            // Update seat table
// Update seat table with category info
            const updateSeatResponse = await fetch(`${BASE_URLS.seats}/${selectedBranch}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    allocated: true,  // Include allocation status
                    category: currentStudentPreferences.category // Pass the selected category ('general', 'obc', 'sc', 'st')
                })
            });

            if (!updateSeatResponse.ok) {
                console.warn('Failed to update seat allocation');
            } else {
                console.log('Seat allocation updated successfully');
            }

    
            // Remove student from preferences queue
          
            const removePreferenceResponse = await fetch(`${BASE_URLS.preferences}/${currentStudentPreferences.rollNumber}`, {
                method: 'DELETE'
            });
    
            if (!removePreferenceResponse.ok) {
                console.warn('Could not remove student from preferences queue');
            }
    
            // Remove student from local queue
            studentQueue.shift();
    
            // Load next student
            loadNextStudent();
    
            // Refresh branches and dashboard
            fetchBranches();
            fetchStudentPreferences(); // Refresh the entire queue
    
            // Provide clear feedback
            const successMessage = `Student ${studentAllocation.studentName} (${studentAllocation.rollNumber}) successfully allocated to ${selectedBranch}`;
            alert(successMessage);
            console.log(successMessage);
        } catch (error) {
            console.error('Allocation error:', error);
        }
    }
    

    // Skip student function
    async function skipStudent() {
        if (!currentStudentPreferences) return;

        // Move current student to the end of the queue
        studentQueue.push(studentQueue.shift());

        // Optional: Check if student has exhausted all branch preferences
        if (currentStudentPreferences.branches.length === 0) {
            try {
                // Remove student from preferences queue
                const removePreferenceResponse = await fetch(`${BASE_URLS.preferences}/${currentStudentPreferences.rollNumber}`, {
                    method: 'DELETE'
                });

                if (!removePreferenceResponse.ok) {
                    console.warn('Could not remove student from preferences queue');
                }

                // Remove from local queue
                studentQueue.shift();
            } catch (error) {
                console.error('Error removing student preference:', error);
            }
        }

        // Load next student
        loadNextStudent();
    }

    // Find available branch for student
    async function findAvailableBranch(student) {
        try {
            const response = await fetch(`${BASE_URLS.seats}/available`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    preferredBranches: student.branches,
                    category: student.category
                })
            });

            if (!response.ok) {
                throw new Error('Failed to check available branches');
            }

            const availableBranch = await response.json();
            return availableBranch;
        } catch (error) {
            console.error('Branch availability check failed:', error);
            return null;
        }
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        // Implement logout logic here (e.g., clearing session, redirecting to login page)
        localStorage.removeItem('token');
        window.location.href = '../Login/login.html'; // Redirect to login page
    });

    // Attach event listeners
    branchSeatForm.addEventListener('submit', addBranch);
    editSeatForm.addEventListener('submit', updateBranch);
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
        editModal.classList.remove('flex');
    });

    // Student Queue Event Listeners
    currentStudentSection.admitBtn.addEventListener('click', admitStudent);
    currentStudentSection.skipBtn.addEventListener('click', skipStudent);

    // Make functions available globally
    window.deleteBranch = deleteBranch;
    window.editBranch = editBranch;

    // Initial fetches
    fetchBranches();
    fetchStudentPreferences();
});


// Global variables for authentication and data management
let userData = null;
let allSeatData = null; // Store the complete original data

// Function to check login status
function checkLoginStatus() {
    const token = localStorage.getItem('userToken');
    return !!token;
}

// Function to update UI based on login status
function updateUIForLoginStatus(isLoggedIn) {
    const publicHeader = document.getElementById('public-header');
    const userHeader = document.getElementById('user-header');
    const authMessage = document.getElementById('auth-message');
    const updateBtn = document.getElementById('update-btn');

    if (!publicHeader || !userHeader || !authMessage || !updateBtn) {
        console.error('One or more UI elements not found!', {
            publicHeader, userHeader, authMessage, updateBtn
        });
        return;
    }

    if (isLoggedIn) {
        publicHeader.style.display = 'none';
        userHeader.style.display = 'flex';
        authMessage.style.display = 'none';
        updateBtn.style.display = 'block';
    } else {
        publicHeader.style.display = 'flex';
        userHeader.style.display = 'none';
        authMessage.style.display = 'flex';
        updateBtn.style.display = 'none';
    }
}

// Function to fetch seat data from backend
function fetchAndDisplaySeatData() {
    const seatMatrixContainer = document.getElementById('seat-matrix');
    const summaryStatsContainer = document.getElementById('summary-stats');

    // Verify container elements exist
    if (!seatMatrixContainer || !summaryStatsContainer) {
        console.error('Seat matrix or summary stats container not found!', {
            seatMatrixContainer, 
            summaryStatsContainer
        });
        return;
    }

    // Reset containers
    seatMatrixContainer.innerHTML = '<div class="loading">Loading seat data...</div>';
    summaryStatsContainer.innerHTML = '<div class="loading">Loading summary data...</div>';

    // Get selected filters
    const academicYear = document.getElementById('academic-year').value;
    const category = document.getElementById('category').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();

    // Fetch data from backend with filters
    fetch(`http://localhost:8080/api/seats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Store the complete original data
        allSeatData = data;
        
        // Validate received data
        if (!Array.isArray(data)) {
            console.error('Received data is not an array:', data);
            throw new Error('Invalid data format');
        }

        // Filter data based on category and search term
        const filteredData = data.filter(branch => {
            // Search term filtering
            const branchName = (branch.branch || '').toLowerCase();
            const matchesSearch = !searchTerm || branchName.includes(searchTerm);

            // Category filtering with seat availability check
            if (category !== 'all') {
                const categoryKey = category.toLowerCase() + 'Seats';
                const availableCategorySeats = branch[categoryKey] || 0;
                
                // Check if the branch has available seats in the selected category
                return matchesSearch && availableCategorySeats > 0;
            }

            return matchesSearch;
        });
        
        // Clear loading states
        seatMatrixContainer.innerHTML = '';
        summaryStatsContainer.innerHTML = '';

        // Generate branch cards
        if (filteredData.length === 0) {
            seatMatrixContainer.innerHTML = `
                <div class="no-results" style="text-align: center; width: 100%; padding: 2rem; color: var(--indigo-700);">
                    No branches found with available seats matching the selected filters.
                </div>
            `;
        } else {
            filteredData.forEach(branch => {
                // If a specific category is selected, only show that category's seats
                if (category !== 'all') {
                    branch = modifyBranchForCategory(branch, category);
                }
                seatMatrixContainer.innerHTML += createBranchCard(branch);
            });
        }

        // Create summary stats based on filtered and potentially modified data
        summaryStatsContainer.innerHTML = createSummaryStats(filteredData, category);

        // Update UI based on login status
        updateUIForLoginStatus(checkLoginStatus());
    })
    .catch(error => {
        console.error('Complete Error Details:', {
            message: error.message,
            stack: error.stack
        });
        
        seatMatrixContainer.innerHTML = `
            <div class="error-message">
                Unable to load seat data. ${error.message}
                <br>Check console for more details.
            </div>
        `;
        summaryStatsContainer.innerHTML = '';
    });
}

// Function to modify branch data when a specific category is selected
function modifyBranchForCategory(branch, selectedCategory) {
    const categoryMap = {
        'general': ['generalSeats', 'filledGeneralSeats'],
        'obc': ['obcSeats', 'filledObcSeats'],
        'sc': ['scSeats', 'filledScSeats'],
        'st': ['stSeats', 'filledStSeats']
    };

    const [totalSeatsKey, filledSeatsKey] = categoryMap[selectedCategory];

    // Create a new object with only the selected category's seats
    return {
        ...branch,
        generalSeats: selectedCategory === 'general' ? branch.generalSeats : 0,
        obcSeats: selectedCategory === 'obc' ? branch.obcSeats : 0,
        scSeats: selectedCategory === 'sc' ? branch.scSeats : 0,
        stSeats: selectedCategory === 'st' ? branch.stSeats : 0,
        filledGeneralSeats: selectedCategory === 'general' ? branch.filledGeneralSeats : 0,
        filledObcSeats: selectedCategory === 'obc' ? branch.filledObcSeats : 0,
        filledScSeats: selectedCategory === 'sc' ? branch.filledScSeats : 0,
        filledStSeats: selectedCategory === 'st' ? branch.filledStSeats : 0,
        totalSeats: branch[totalSeatsKey] || 0
    };
}

// Modify the createBranchCard function to correctly handle seat data
function createBranchCard(branch) {
    const categories = [
        { name: 'General', key: 'generalSeats', filled: 'filledGeneralSeats' },
        { name: 'OBC', key: 'obcSeats', filled: 'filledObcSeats' },
        { name: 'SC', key: 'scSeats', filled: 'filledScSeats' },
        { name: 'ST', key: 'stSeats', filled: 'filledStSeats' }
    ];

    // Filter out categories with 0 seats
    const filteredCategories = categories.filter(category => 
        (branch[category.key] || 0) > 0
    );

    const categoryHTML = filteredCategories.map(category => {
        const totalCategorySeats = branch[category.key] || 0;
        const filledCategorySeats = branch[category.filled] || 0;

        return `
            <div class="seat-category">
                <span class="category-name">${category.name}</span>
                <span class="seat-count">${filledCategorySeats} / ${totalCategorySeats}</span>
            </div>
        `;
    }).join('');

    const isLoggedIn = checkLoginStatus();
    const editableClass = isLoggedIn ? 'editable' : '';

    return `
        <div class="branch-card ${editableClass}" data-branch="${branch.branch}">
            <div class="branch-header">${branch.branch || 'Unknown Branch'}</div>
            <div class="branch-body">
                ${categoryHTML}
                <div class="total-seats">
                    <span>Total Seats</span>
                    <span>${branch.totalSeats || 0}</span>
                </div>
                ${isLoggedIn ? '<div class="tooltip">Click to edit</div>' : ''}
            </div>
        </div>
    `;
}

// Modify the createSummaryStats function to correctly calculate statistics
function createSummaryStats(data, selectedCategory = 'all') {
    let totalBranches = data.length;
    let totalSeats = 0, filledSeats = 0;

    data.forEach(branch => {
        // Determine which seats to count based on selected category
        if (selectedCategory === 'all') {
            // Sum total seats for all categories
            totalSeats += branch.totalSeats || (
                (branch.generalSeats || 0) + 
                (branch.obcSeats || 0) + 
                (branch.scSeats || 0) + 
                (branch.stSeats || 0)
            );

            // Sum filled seats for all categories
            filledSeats += (
                (branch.filledGeneralSeats || 0) + 
                (branch.filledObcSeats || 0) + 
                (branch.filledScSeats || 0) + 
                (branch.filledStSeats || 0)
            );
        } else {
            // Sum seats for the selected category
            const categoryMap = {
                'general': ['generalSeats', 'filledGeneralSeats'],
                'obc': ['obcSeats', 'filledObcSeats'],
                'sc': ['scSeats', 'filledScSeats'],
                'st': ['stSeats', 'filledStSeats']
            };

            const [totalSeatsKey, filledSeatsKey] = categoryMap[selectedCategory];
            
            totalSeats += branch[totalSeatsKey] || 0;
            filledSeats += branch[filledSeatsKey] || 0;
        }
    });

    const vacantSeats = totalSeats - filledSeats;
    const filledPercentage = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;
    const vacantPercentage = 100 - filledPercentage;

    return `
        <div class="stat-card">
            <div class="stat-title">Total Branches</div>
            <div class="stat-value">${totalBranches}</div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Total Seats</div>
            <div class="stat-value">${totalSeats}</div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Filled Seats</div>
            <div class="stat-value">${filledSeats}</div>
            <div class="stat-percentage">${filledPercentage}% filled</div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Vacant Seats</div>
            <div class="stat-value">${vacantSeats}</div>
            <div class="stat-percentage">${vacantPercentage}% vacant</div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Login button event listeners
    const loginBtns = document.querySelectorAll('#login-btn, .auth-message .login-btn');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Login Button Clicked');
            // Redirect to login page or show login modal
            // This is a placeholder - replace with your actual login logic
            alert('Login functionality to be implemented');
        });
    });

    // Filter change event listeners
    document.getElementById('academic-year').addEventListener('change', () => {
        fetchAndDisplaySeatData();
    });
    
    document.getElementById('category').addEventListener('change', () => {
        fetchAndDisplaySeatData();
    });
    
    document.getElementById('search').addEventListener('input', () => {
        fetchAndDisplaySeatData();
    });

    // Update seats button event listener
    document.getElementById('update-btn').addEventListener('click', () => {
        if (!checkLoginStatus()) {
            alert('Please login to update seats');
            return;
        }
        // Implement seat update logic here
        alert('Seat update functionality to be implemented');
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check login status and update UI
    updateUIForLoginStatus(checkLoginStatus());

    // Fetch and display seat data
    fetchAndDisplaySeatData();

    // Setup event listeners
    setupEventListeners();
});

// Add global error handling
window.addEventListener('error', (event) => {
    console.error('Uncaught Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});




// // Global variables for authentication and data management
// // let userData = null;
// // let allSeatData = null; // Store the complete original data

// // Function to check login status
// function checkLoginStatus() {
//     const token = localStorage.getItem('userToken');
//     return !!token;
// }

// // Function to update UI based on login status
// function updateUIForLoginStatus(isLoggedIn) {
//     const publicHeader = document.getElementById('public-header');
//     const userHeader = document.getElementById('user-header');
//     const authMessage = document.getElementById('auth-message');
//     const updateBtn = document.getElementById('update-btn');

//     if (!publicHeader || !userHeader || !authMessage || !updateBtn) {
//         console.error('One or more UI elements not found!', {
//             publicHeader, userHeader, authMessage, updateBtn
//         });
//         return;
//     }

//     if (isLoggedIn) {
//         publicHeader.style.display = 'none';
//         userHeader.style.display = 'flex';
//         authMessage.style.display = 'none';
//         updateBtn.style.display = 'block';
//     } else {
//         publicHeader.style.display = 'flex';
//         userHeader.style.display = 'none';
//         authMessage.style.display = 'flex';
//         updateBtn.style.display = 'none';
//     }
// }

// // Function to fetch seat data from backend
// function fetchAndDisplaySeatData() {
//     const seatMatrixContainer = document.getElementById('seat-matrix');
//     const summaryStatsContainer = document.getElementById('summary-stats');

//     // Verify container elements exist
//     if (!seatMatrixContainer || !summaryStatsContainer) {
//         console.error('Seat matrix or summary stats container not found!', {
//             seatMatrixContainer, 
//             summaryStatsContainer
//         });
//         return;
//     }

//     // Reset containers
//     seatMatrixContainer.innerHTML = '<div class="loading">Loading seat data...</div>';
//     summaryStatsContainer.innerHTML = '<div class="loading">Loading summary data...</div>';

//     // Get selected filters
//     const academicYear = document.getElementById('academic-year').value;
//     const category = document.getElementById('category').value;
//     const searchTerm = document.getElementById('search').value.toLowerCase();

//     // Fetch data from backend with filters
//     fetch(`http://localhost:8080/api/seats`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Store the complete original data
//         allSeatData = data;
        
//         // Validate received data
//         if (!Array.isArray(data)) {
//             console.error('Received data is not an array:', data);
//             throw new Error('Invalid data format');
//         }

//         // Filter data based on category and search term
//         const filteredData = data.filter(branch => {
//             // Search term filtering
//             const branchName = (branch.branch || '').toLowerCase();
//             const matchesSearch = !searchTerm || branchName.includes(searchTerm);

//             // Category filtering with seat availability check
//             if (category !== 'all') {
//                 const categoryKey = category.toLowerCase() + 'Seats';
//                 const availableCategorySeats = branch[categoryKey] || 0;
                
//                 // Check if the branch has available seats in the selected category
//                 return matchesSearch && availableCategorySeats > 0;
//             }

//             return matchesSearch;
//         });
        
//         // Clear loading states
//         seatMatrixContainer.innerHTML = '';
//         summaryStatsContainer.innerHTML = '';

//         // Generate branch cards
//         if (filteredData.length === 0) {
//             seatMatrixContainer.innerHTML = `
//                 <div class="no-results" style="text-align: center; width: 100%; padding: 2rem; color: var(--indigo-700);">
//                     No branches found with available seats matching the selected filters.
//                 </div>
//             `;
//         } else {
//             filteredData.forEach(branch => {
//                 // If a specific category is selected, only show that category's seats
//                 if (category !== 'all') {
//                     branch = modifyBranchForCategory(branch, category);
//                 }
//                 seatMatrixContainer.innerHTML += createBranchCard(branch);
//             });
//         }

//         // Create summary stats based on filtered and potentially modified data
//         summaryStatsContainer.innerHTML = createSummaryStats(filteredData, category);

//         // Update UI based on login status
//         updateUIForLoginStatus(checkLoginStatus());
//     })
//     .catch(error => {
//         console.error('Complete Error Details:', {
//             message: error.message,
//             stack: error.stack
//         });
        
//         seatMatrixContainer.innerHTML = `
//             <div class="error-message">
//                 Unable to load seat data. ${error.message}
//                 <br>Check console for more details.
//             </div>
//         `;
//         summaryStatsContainer.innerHTML = '';
//     });
// }

// // Function to modify branch data when a specific category is selected
// function modifyBranchForCategory(branch, selectedCategory) {
//     const categoryMap = {
//         'general': ['generalSeats', 'filledGeneralSeats'],
//         'obc': ['obcSeats', 'filledObcSeats'],
//         'sc': ['scSeats', 'filledScSeats'],
//         'st': ['stSeats', 'filledStSeats']
//     };

//     const [totalSeatsKey, filledSeatsKey] = categoryMap[selectedCategory];

//     // Create a new object with only the selected category's seats
//     return {
//         ...branch,
//         generalSeats: selectedCategory === 'general' ? branch.generalSeats : 0,
//         obcSeats: selectedCategory === 'obc' ? branch.obcSeats : 0,
//         scSeats: selectedCategory === 'sc' ? branch.scSeats : 0,
//         stSeats: selectedCategory === 'st' ? branch.stSeats : 0,
//         filledGeneralSeats: selectedCategory === 'general' ? branch.filledGeneralSeats : 0,
//         filledObcSeats: selectedCategory === 'obc' ? branch.filledObcSeats : 0,
//         filledScSeats: selectedCategory === 'sc' ? branch.filledScSeats : 0,
//         filledStSeats: selectedCategory === 'st' ? branch.filledStSeats : 0,
//         totalSeats: branch[totalSeatsKey] || 0
//     };
// }

// // Modify the createBranchCard function to correctly handle seat data
// function createBranchCard(branch) {
//     const categories = [
//         { name: 'General', key: 'generalSeats', filled: 'filledGeneralSeats' },
//         { name: 'OBC', key: 'obcSeats', filled: 'filledObcSeats' },
//         { name: 'SC', key: 'scSeats', filled: 'filledScSeats' },
//         { name: 'ST', key: 'stSeats', filled: 'filledStSeats' }
//     ];

//     // Filter out categories with 0 seats
//     const filteredCategories = categories.filter(category => 
//         (branch[category.key] || 0) > 0
//     );

//     const categoryHTML = filteredCategories.map(category => {
//         const totalCategorySeats = branch[category.key] || 0;
//         const filledCategorySeats = branch[category.filled] || 0;

//         return `
//             <div class="seat-category">
//                 <span class="category-name">${category.name}</span>
//                 <span class="seat-count">${filledCategorySeats} / ${totalCategorySeats}</span>
//             </div>
//         `;
//     }).join('');

//     const isLoggedIn = checkLoginStatus();
//     const editableClass = isLoggedIn ? 'editable' : '';

//     return `
//         <div class="branch-card ${editableClass}" data-branch="${branch.branch}">
//             <div class="branch-header">${branch.branch || 'Unknown Branch'}</div>
//             <div class="branch-body">
//                 ${categoryHTML}
//                 <div class="total-seats">
//                     <span>Total Seats</span>
//                     <span>${branch.totalSeats || 0}</span>
//                 </div>
//                 ${isLoggedIn ? '<div class="tooltip">Click to edit</div>' : ''}
//             </div>
//         </div>
//     `;
// }

// // Modify the createSummaryStats function to correctly calculate statistics
// function createSummaryStats(data, selectedCategory = 'all') {
//     let totalBranches = data.length;
//     let totalSeats = 0, filledSeats = 0;

//     data.forEach(branch => {
//         // Determine which seats to count based on selected category
//         if (selectedCategory === 'all') {
//             // Sum total seats for all categories
//             totalSeats += branch.totalSeats || (
//                 (branch.generalSeats || 0) + 
//                 (branch.obcSeats || 0) + 
//                 (branch.scSeats || 0) + 
//                 (branch.stSeats || 0)
//             );

//             // Sum filled seats for all categories
//             filledSeats += (
//                 (branch.filledGeneralSeats || 0) + 
//                 (branch.filledObcSeats || 0) + 
//                 (branch.filledScSeats || 0) + 
//                 (branch.filledStSeats || 0)
//             );
//         } else {
//             // Sum seats for the selected category
//             const categoryMap = {
//                 'general': ['generalSeats', 'filledGeneralSeats'],
//                 'obc': ['obcSeats', 'filledObcSeats'],
//                 'sc': ['scSeats', 'filledScSeats'],
//                 'st': ['stSeats', 'filledStSeats']
//             };

//             const [totalSeatsKey, filledSeatsKey] = categoryMap[selectedCategory];
            
//             totalSeats += branch[totalSeatsKey] || 0;
//             filledSeats += branch[filledSeatsKey] || 0;
//         }
//     });

//     const vacantSeats = totalSeats - filledSeats;
//     const filledPercentage = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;
//     const vacantPercentage = 100 - filledPercentage;

//     return `
//         <div class="stat-card">
//             <div class="stat-title">Total Branches</div>
//             <div class="stat-value">${totalBranches}</div>
//         </div>
//         <div class="stat-card">
//             <div class="stat-title">Total Seats</div>
//             <div class="stat-value">${totalSeats}</div>
//         </div>
//         <div class="stat-card">
//             <div class="stat-title">Filled Seats</div>
//             <div class="stat-value">${filledSeats}</div>
//             <div class="stat-percentage">${filledPercentage}% filled</div>
//         </div>
//         <div class="stat-card">
//             <div class="stat-title">Vacant Seats</div>
//             <div class="stat-value">${vacantSeats}</div>
//             <div class="stat-percentage">${vacantPercentage}% vacant</div>
//         </div>
//     `;
// }

// // Setup event listeners
// function setupEventListeners() {
//     // Login button event listeners
//     const loginBtns = document.querySelectorAll('#login-btn, .auth-message .login-btn');
//     loginBtns.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault();
//             console.log('Login Button Clicked');
//             // Redirect to login page or show login modal
//             // This is a placeholder - replace with your actual login logic
//             alert('Login functionality to be implemented');
//         });
//     });

//     // Filter change event listeners
//     document.getElementById('academic-year').addEventListener('change', () => {
//         fetchAndDisplaySeatData();
//     });
    
//     document.getElementById('category').addEventListener('change', () => {
//         fetchAndDisplaySeatData();
//     });
    
//     document.getElementById('search').addEventListener('input', () => {
//         fetchAndDisplaySeatData();
//     });

//     // Update seats button event listener
//     document.getElementById('update-btn').addEventListener('click', () => {
//         if (!checkLoginStatus()) {
//             alert('Please login to update seats');
//             return;
//         }
//         // Implement seat update logic here
//         alert('Seat update functionality to be implemented');
//     });
// }

// // Initialize the page
// document.addEventListener('DOMContentLoaded', () => {
//     // Check login status and update UI
//     updateUIForLoginStatus(checkLoginStatus());

//     // Fetch and display seat data
//     fetchAndDisplaySeatData();

//     // Setup event listeners
//     setupEventListeners();
// });

// // Add global error handling
// window.addEventListener('error', (event) => {
//     console.error('Uncaught Error:', {
//         message: event.message,
//         filename: event.filename,
//         lineno: event.lineno,
//         colno: event.colno,
//         error: event.error
//     });
// });