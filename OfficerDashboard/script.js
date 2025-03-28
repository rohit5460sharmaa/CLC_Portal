// Seat Allocation Management System Script

document.addEventListener('DOMContentLoaded', function() {
    // Base URLs for backend APIs
    const BASE_URLS = {
        seats: 'http://localhost:8080/api/seats',
        preferences: 'http://localhost:8080/api/preferences',
        allocation: 'http://localhost:8080/api/allocations',
        students: 'http://localhost:8080/students'
    };

    // DOM Elements
    const branchSeatForm = document.getElementById('branch-seat-form');
    const seatMatrixBody = document.getElementById('seat-matrix-body');
    const editModal = document.getElementById('edit-modal');
    const editSeatForm = document.getElementById('edit-seat-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const studentQueueBody = document.getElementById('student-queue-body');
    const studentCountBadge = document.getElementById('student-count-badge');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const logoutBtn = document.getElementById('logout-btn');
    const sections = document.querySelectorAll('.section');
    const seatMatrixContainer = document.getElementById('seat-matrix');
    const summaryStatsContainer = document.getElementById('summary-stats');
    const academicYearFilter = document.getElementById('academic-year');
    const categoryFilterSeat = document.getElementById('category');
    const searchFilter = document.getElementById('search');

    const dashboardSection = document.getElementById('dashboard');
    const seatManagementSection = document.getElementById('seat-management');
    const seatMatrixSection = document.getElementById('seat-matrix-box');
    const studentQueueSection = document.getElementById('student-queue');

    // Navigation links
    const navLinks = {
        dashboard: document.getElementById('dashboard-link'),
        seatManagement: document.getElementById('seat-management-link'),
        seatMatrix: document.getElementById('seat-matrix-link'),
        studentQueue: document.getElementById('student-queue-link')
    };

    // Student queue data
    let studentQueue = [];
    let filteredStudentQueue = [];
    let allSeatData = [];
    // Initialize the application
    function init() {
        setupNavigation();
        setupEventListeners();
        fetchInitialData();
        // Show dashboard by default
        showSection('dashboard');
    }

    // Updated Navigation functionality
    function setupNavigation() {
        navLinks.dashboard.addEventListener('click', () => showSection('dashboard'));
        navLinks.seatManagement.addEventListener('click', () => showSection('seat-management'));
        navLinks.seatMatrix.addEventListener('click', () => showSection('seat-matrix-box'));
        navLinks.studentQueue.addEventListener('click', () => showSection('student-queue'));
    }

    function showSection(sectionId) {
        // Hide all sections first
        [dashboardSection, seatManagementSection, seatMatrixSection, studentQueueSection].forEach(section => {
            if (section) section.classList.add('hidden');
        });

        // Show only the selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
        }

        // Optional: Highlight active navigation link
        Object.values(navLinks).forEach(link => {
            link.classList.remove('active');
        });
        navLinks[sectionId.replace('-', '')].classList.add('active');
    }


    // Event listeners setup
    function setupEventListeners() {
        // Form submissions
        if (branchSeatForm) branchSeatForm.addEventListener('submit', addBranch);
        if (editSeatForm) editSeatForm.addEventListener('submit', updateBranch);
        
        // Modal controls
        if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => {
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
        });
        
        // Logout
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
        
        // Seat matrix filters
        if (academicYearFilter) academicYearFilter.addEventListener('change', fetchAndDisplaySeatData);
        if (categoryFilterSeat) categoryFilterSeat.addEventListener('change', fetchAndDisplaySeatData);
        if (searchFilter) searchFilter.addEventListener('input', fetchAndDisplaySeatData);
    }

    // Fetch initial data
    function fetchInitialData() {
        fetchBranches();
        fetchStudentPreferences();
        fetchAndDisplaySeatData();
    }

    // Seat Management Functions
    async function fetchBranches() {
        try {
            const response = await fetch(BASE_URLS.seats);
            if (!response.ok) throw new Error('Failed to fetch branches');
            const branches = await response.json();
            
            seatMatrixBody.innerHTML = '';
            branches.forEach(branch => createBranchRow(branch));
            updateDashboardStats(branches);
        } catch (error) {
            handleError('Error fetching branches:', error);
        }
    }

    function createBranchRow(branch) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${branch.branch}</td>
            <td class="px-4 py-2">${branch.generalSeats + branch.scSeats + branch.stSeats + branch.obcSeats}</td>
            <td class="px-4 py-2">${branch.generalSeats}</td>
            <td class="px-4 py-2">${branch.scSeats}</td>
            <td class="px-4 py-2">${branch.stSeats}</td>
            <td class="px-4 py-2">${branch.obcSeats}</td>
            <td class="px-4 py-2 space-x-2">
                <button class="edit-btn text-blue-600 hover:text-blue-800" data-id="${branch.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn text-red-600 hover:text-red-800" data-id="${branch.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        seatMatrixBody.appendChild(row);
        
        // Add event listeners to the new buttons
        row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(branch));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteBranch(branch.id));
    }

    function openEditModal(branch) {
        document.getElementById('edit-seat-id').value = branch.id;
        document.getElementById('edit-branch-name').value = branch.branch;
        document.getElementById('edit-gen-seats').value = branch.generalSeats;
        document.getElementById('edit-sc-seats').value = branch.scSeats;
        document.getElementById('edit-st-seats').value = branch.stSeats;
        document.getElementById('edit-obc-seats').value = branch.obcSeats;

        editModal.classList.remove('hidden');
        editModal.classList.add('flex');
    }

    async function addBranch(e) {
        e.preventDefault();
        
        const branchData = {
            branch: document.getElementById('branch-name').value,
            generalSeats: parseInt(document.getElementById('gen-seats').value) || 0,
            scSeats: parseInt(document.getElementById('sc-seats').value) || 0,
            stSeats: parseInt(document.getElementById('st-seats').value) || 0,
            obcSeats: parseInt(document.getElementById('obc-seats').value) || 0,
            filledGeneralSeats: 0,
            filledScSeats: 0,
            filledStSeats: 0,
            filledObcSeats: 0
        };

        try {
            const response = await fetch(BASE_URLS.seats, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(branchData)
            });

            if (!response.ok) throw new Error('Failed to add branch');
            
            branchSeatForm.reset();
            fetchBranches();
        } catch (error) {
            handleError('Error adding branch:', error);
        }
    }

    async function updateBranch(e) {
        e.preventDefault();

        const id = document.getElementById('edit-seat-id').value;
        const branchData = {
            branch: document.getElementById('edit-branch-name').value,
            generalSeats: parseInt(document.getElementById('edit-gen-seats').value) || 0,
            scSeats: parseInt(document.getElementById('edit-sc-seats').value) || 0,
            stSeats: parseInt(document.getElementById('edit-st-seats').value) || 0,
            obcSeats: parseInt(document.getElementById('edit-obc-seats').value) || 0,
            filledGeneralSeats: 0,
            filledScSeats: 0,
            filledStSeats: 0,
            filledObcSeats: 0
        };

        try {
            const response = await fetch(`${BASE_URLS.seats}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(branchData)
            });

            if (!response.ok) throw new Error('Failed to update branch');
            
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
            fetchBranches();
        } catch (error) {
            handleError('Error updating branch:', error);
        }
    }

    async function deleteBranch(id) {
        if (!confirm('Are you sure you want to delete this branch?')) return;
        
        try {
            const response = await fetch(`${BASE_URLS.seats}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete branch');
            fetchBranches();
        } catch (error) {
            handleError('Error deleting branch:', error);
        }
    }

    function updateDashboardStats(branches) {
        const totalSeats = branches.reduce((sum, branch) => 
            sum + branch.generalSeats + branch.scSeats + branch.stSeats + branch.obcSeats, 0);
        const admittedStudents = branches.reduce((sum, branch) => 
            sum + branch.filledGeneralSeats + branch.filledScSeats + branch.filledStSeats + branch.filledObcSeats, 0);
        
        document.getElementById('total-students').textContent = totalSeats;
        document.getElementById('vacant-seats').textContent = totalSeats - admittedStudents;
        document.getElementById('admitted-students').textContent = admittedStudents;
    }

    // Student Queue Functions
    async function fetchStudentPreferences() {
        try {
            const response = await fetch(`${BASE_URLS.preferences}/all`);
            if (!response.ok) throw new Error('Failed to fetch student preferences');
            
            studentQueue = await response.json();
            studentQueue.sort((a, b) => a.rank - b.rank);
            
            populateCategoryFilter();
            renderStudentQueue();
        } catch (error) {
            handleError('Error fetching student preferences:', error);
        }
    }

    function populateCategoryFilter() {
        const categories = [...new Set(studentQueue.map(student => student.category))];
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function filterStudents() {
        const categoryValue = categoryFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        filteredStudentQueue = studentQueue.filter(student => {
            const matchesCategory = !categoryValue || student.category === categoryValue;
            const matchesSearch = !searchValue || 
                student.studentName.toLowerCase().includes(searchValue) ||
                student.rollNumber.toLowerCase().includes(searchValue);
            
            return matchesCategory && matchesSearch;
        });

        renderStudentQueue(filteredStudentQueue);
    }

    function renderStudentQueue(queue = studentQueue) {
        studentQueueBody.innerHTML = '';
        studentCountBadge.textContent = queue.length;

        queue.forEach((student) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3 whitespace-nowrap font-medium text-gray-900">${student.rank}</td>
                <td class="p-3 whitespace-nowrap">${student.studentName}</td>
                <td class="p-3 whitespace-nowrap">${student.category}</td>
                <td class="p-3 whitespace-nowrap">
                    <select class="w-full p-2 border rounded-md branch-select" data-roll-number="${student.rollNumber}">
                        <option value="">Select Branch</option>
                        ${student.branches.map((branch, index) => 
                            `<option value="${branch}" ${student.selectedBranch === branch ? 'selected' : ''}>
                                ${index + 1}. ${branch}
                            </option>`
                        ).join('')}
                    </select>
                </td>
                <td class="p-3 whitespace-nowrap space-x-2">
                    <button class="admit-btn bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" data-roll-number="${student.rollNumber}">
                        Admit
                    </button>
                    <button class="not-admit-btn bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" data-roll-number="${student.rollNumber}">
                        Not Admit
                    </button>
                    <button class="skip-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" data-roll-number="${student.rollNumber}">
                        Skip
                    </button>
                </td>
            `;
            studentQueueBody.appendChild(row);
        });

        // Add event listeners to the new elements
        document.querySelectorAll('.branch-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const rollNumber = e.target.getAttribute('data-roll-number');
                const student = studentQueue.find(s => s.rollNumber === rollNumber);
                if (student) student.selectedBranch = e.target.value;
            });
        });

        document.querySelectorAll('.admit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => admitStudent(e.target.getAttribute('data-roll-number')));
        });

        document.querySelectorAll('.not-admit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => notAdmitStudent(e.target.getAttribute('data-roll-number')));
        });

        document.querySelectorAll('.skip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => skipStudent(e.target.getAttribute('data-roll-number')));
        });
    }

    async function admitStudent(rollNumber) {
        const student = studentQueue.find(s => s.rollNumber === rollNumber);
        if (!student || !student.selectedBranch) {
            alert('Please select a branch first');
            return;
        }

        try {
            // Check if already allocated
            const checkResponse = await fetch(`${BASE_URLS.allocation}/${rollNumber}`);
            if (checkResponse.ok) {
                alert('Student is already allocated.');
                return;
            }

            // Create allocation
            const allocationResponse = await fetch(BASE_URLS.allocation, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rollNumber: student.rollNumber,
                    studentName: student.studentName,
                    category: student.category,
                    rank: student.rank,
                    branch: student.selectedBranch
                })
            });

            if (!allocationResponse.ok) throw new Error('Allocation failed');

            // Update student status
            await fetch(`${BASE_URLS.students}/${student.rollNumber}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admitted: true })
            });

            // Remove from queue
            studentQueue = studentQueue.filter(s => s.rollNumber !== rollNumber);
            renderStudentQueue();
        } catch (error) {
            handleError('Error admitting student:', error);
        }
    }

    function notAdmitStudent(rollNumber) {
        studentQueue = studentQueue.filter(s => s.rollNumber !== rollNumber);
        renderStudentQueue();
    }

    function skipStudent(rollNumber) {
        const index = studentQueue.findIndex(s => s.rollNumber === rollNumber);
        if (index !== -1) {
            const [student] = studentQueue.splice(index, 1);
            studentQueue.push(student);
            renderStudentQueue();
        }
    }

    // Seat Matrix Display Functions
    async function fetchAndDisplaySeatData() {
        try {
            const response = await fetch(BASE_URLS.seats);
            if (!response.ok) throw new Error('Failed to fetch seat data');
            
            allSeatData = await response.json();
            renderSeatMatrix(allSeatData);
        } catch (error) {
            handleError('Error fetching seat data:', error);
        }
    }

    function renderSeatMatrix(data) {
        if (!seatMatrixContainer || !summaryStatsContainer) {
            console.error('Required containers not found');
            return;
        }

        // Get filters
        const category = categoryFilterSeat ? categoryFilterSeat.value : 'all';
        const searchTerm = searchFilter ? searchFilter.value.toLowerCase() : '';

        // Filter data
        const filteredData = data.filter(branch => {
            const matchesSearch = !searchTerm || 
                (branch.branch || '').toLowerCase().includes(searchTerm);
            
            if (category === 'all') return matchesSearch;
            
            const categoryKey = `${category.toLowerCase()}Seats`;
            return matchesSearch && (branch[categoryKey] || 0) > 0;
        });

        // Render branch cards
        seatMatrixContainer.innerHTML = filteredData.length > 0 ? 
            filteredData.map(branch => createBranchCard(branch, category)).join('') :
            '<div class="no-results">No branches found matching filters</div>';

        // Render summary stats
        summaryStatsContainer.innerHTML = createSummaryStats(filteredData, category);
    }

    function createBranchCard(branch, selectedCategory = 'all') {
        const categories = [
            { name: 'General', key: 'generalSeats', filled: 'filledGeneralSeats' },
            { name: 'OBC', key: 'obcSeats', filled: 'filledObcSeats' },
            { name: 'SC', key: 'scSeats', filled: 'filledScSeats' },
            { name: 'ST', key: 'stSeats', filled: 'filledStSeats' }
        ];

        // Filter categories based on selection
        const displayCategories = selectedCategory === 'all' ? 
            categories.filter(cat => branch[cat.key] > 0) :
            categories.filter(cat => cat.key === `${selectedCategory.toLowerCase()}Seats` && branch[cat.key] > 0);

        const categoryHTML = displayCategories.map(cat => `
            <div class="seat-category">
                <span class="category-name">${cat.name}</span>
                <span class="seat-count">
                    ${branch[cat.filled] || 0} / ${branch[cat.key] || 0}
                </span>
            </div>
        `).join('');

        const totalSeats = displayCategories.reduce((sum, cat) => sum + (branch[cat.key] || 0), 0);
        const isLoggedIn = checkLoginStatus();

        return `
            <div class="branch-card ${isLoggedIn ? 'editable' : ''}" data-branch="${branch.branch}">
                <div class="branch-header">${branch.branch || 'Unknown Branch'}</div>
                <div class="branch-body">
                    ${categoryHTML}
                    <div class="total-seats">
                        <span>Total Seats</span>
                        <span>${totalSeats}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function createSummaryStats(data, selectedCategory = 'all') {
        let totalSeats = 0, filledSeats = 0;

        data.forEach(branch => {
            if (selectedCategory === 'all') {
                totalSeats += (branch.generalSeats || 0) + (branch.obcSeats || 0) + 
                             (branch.scSeats || 0) + (branch.stSeats || 0);
                filledSeats += (branch.filledGeneralSeats || 0) + (branch.filledObcSeats || 0) + 
                              (branch.filledScSeats || 0) + (branch.filledStSeats || 0);
            } else {
                const categoryKey = `${selectedCategory.toLowerCase()}Seats`;
                const filledKey = `filled${selectedCategory.charAt(0).toUpperCase()}${selectedCategory.slice(1)}Seats`;
                totalSeats += branch[categoryKey] || 0;
                filledSeats += branch[filledKey] || 0;
            }
        });

        const vacantSeats = totalSeats - filledSeats;
        const filledPercentage = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;
        const vacantPercentage = 100 - filledPercentage;

        return `
            <div class="stat-card">
                <div class="stat-title">Total Branches</div>
                <div class="stat-value">${data.length}</div>
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

    // Helper Functions
    function checkLoginStatus() {
        return !!localStorage.getItem('token');
    }

    function logout() {
        localStorage.removeItem('token');
        window.location.href = '../Login/login.html';
    }

    function handleError(message, error) {
        console.error(message, error);
        alert(`${message} ${error.message}`);
    }

    // Initialize the application
    init();
});