document.addEventListener('DOMContentLoaded', function() {
    const branchSeatForm = document.getElementById('branch-seat-form');
    const seatMatrixBody = document.getElementById('seat-matrix-body');
    const editModal = document.getElementById('edit-modal');
    const editSeatForm = document.getElementById('edit-seat-form');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // Navigation links
    // const dashboardLink = document.getElementById('dashboard-link');
    const seatManagementLink = document.getElementById('seat-management-link');
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

    // dashboardLink.addEventListener('click', () => showSection('dashboard'));
    seatManagementLink.addEventListener('click', () => showSection('seat-management'));
    studentQueueLink.addEventListener('click', () => showSection('student-queue'));
    reportsLink.addEventListener('click', () => showSection('reports'));

    // Base URL for backend API (update this to your actual backend URL)
    const BASE_URL = 'http://localhost:8080/api/seats';

    // Function to fetch branches from backend
    async function fetchBranches() {
        try {
            const response = await fetch(BASE_URL);
            const branches = await response.json();
            
            console.log(branches);
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
            // updateDashboardStats(branches);
            updateReports(branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
            alert('Failed to fetch branches');
        }
    }

    // // Function to update dashboard statistics
    // function updateDashboardStats(branches) {
    //     const totalSeats = branches.reduce((sum, branch) => 
    //         sum + branch.generalSeats + branch.scSeats + branch.stSeats + branch.obcSeats, 0);
    //     const admittedStudents = branches.reduce((sum, branch) => 
    //         sum + branch.filledGeneralSeats + branch.filledScSeats + branch.filledStSeats + branch.filledObcSeats, 0);
        
    //     document.getElementById('total-students').textContent = totalSeats;
    //     document.getElementById('vacant-seats').textContent = totalSeats - admittedStudents;
    //     document.getElementById('admitted-students').textContent = admittedStudents;
    // }

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
            const response = await fetch(BASE_URL, {
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
            const response = await fetch(`${BASE_URL}/${id}`, {
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
            const response = await fetch(`${BASE_URL}/${id}`, {
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

    // Close edit modal
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
        editModal.classList.remove('flex');
    });

    // Attach event listeners
    branchSeatForm.addEventListener('submit', addBranch);
    editSeatForm.addEventListener('submit', updateBranch);

    // Make functions available globally
    window.deleteBranch = deleteBranch;
    window.editBranch = editBranch;

    // Initial fetch of branches
    fetchBranches();

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        // Implement logout logic here (e.g., clearing session, redirecting to login page)
        localStorage.removeItem('token');
        window.location.href = '../Login/login.html'; // Redirect to login page
    });
});
















// Global variables to store current context
let currentOfficers = [];
let currentDeleteUsername = null;

// Utility: Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

document.addEventListener('DOMContentLoaded', () => {
    function displayAdminUsername() {
        const adminUsername = localStorage.getItem('username'); // Retrieve stored username
        const adminIdDisplay = document.getElementById('adminIdDisplay');

        if (adminIdDisplay) {
            if (adminUsername) {
                adminIdDisplay.textContent = `Admin ID: ${adminUsername}`;
            } else {
                adminIdDisplay.textContent = 'Admin ID: Not Available';
            }
        }
    }

    displayAdminUsername(); // Call function to display admin username
});


// Logout functionality
function logout() {
    localStorage.removeItem('token');
    window.location.href = '../Login/login.html'; // Redirect to login page
}

// Display officers in the table
function displayOfficers(officers) {
    const tableBody = document.getElementById('officerTableBody');
    
    if (!tableBody) {
        console.error('🚨 Table body element not found');
        return;
    }

    // Store current officers for filtering
    currentOfficers = officers;

    // Clear existing rows
    tableBody.innerHTML = '';

    if (!Array.isArray(officers) || officers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-gray-500">
                    No officers found
                </td>
            </tr>
        `;
        return;
    }

    // Update stats
    document.getElementById('totalOfficersCount').textContent = officers.length;
    document.getElementById('activeOfficersCount').textContent = 
        officers.filter(officer => officer.enabled).length;

    // Render officers
    officers.forEach(officer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${officer.username || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${officer.name || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${officer.email || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${officer.department || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${officer.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${officer.enabled ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="openEditOfficerModal('${officer.username}')" class="text-indigo-600 hover:text-indigo-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmDeleteOfficer('${officer.username}')" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>`;
        
        tableBody.appendChild(row);
    });
}

// Filter officers based on search and status
function filterOfficers() {
    const searchTerm = document.getElementById('searchOfficers').value.toLowerCase();
    const statusFilter = document.getElementById('officerStatusFilter').value;

    const filteredOfficers = currentOfficers.filter(officer => {
        const matchesSearch = 
            officer.name.toLowerCase().includes(searchTerm) ||
            officer.email.toLowerCase().includes(searchTerm) ||
            officer.username.toLowerCase().includes(searchTerm);

        const matchesStatus = 
            statusFilter === 'all' || 
            (statusFilter === 'active' && officer.enabled) ||
            (statusFilter === 'inactive' && !officer.enabled);

        return matchesSearch && matchesStatus;
    });

    displayOfficers(filteredOfficers);
}

// Open Add Officer Modal
function openAddOfficerModal() {
    document.getElementById('addOfficerModal').classList.remove('hidden');
}

// Close Add Officer Modal
function closeAddOfficerModal() {
    document.getElementById('addOfficerModal').classList.add('hidden');
    document.getElementById('addOfficerForm').reset();
}

async function addNewOfficer(event) {
    event.preventDefault();
    const form = event.target;
    
    // Ensure all required fields are captured
    const officerData = {
        username: form.officerUsername.value,
        email: form.officerEmail.value,
        password: form.officerPassword.value,
        role: form.role.value,
        name: form.officerName.value,
        phone: form.contact.value,
        department: form.officerDepartment.value,
        enabled: form.isActive.checked
    };

    // Validate that no fields are empty
    const requiredFields = ['username', 'email', 'password', 'role', 'name', 'phone', 'department'];
    const missingFields = requiredFields.filter(field => !officerData[field]);

    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(officerData)
        });

        console.log('Response status:', response.status);
        
        const responseText = await response.text();
        console.log('Response body:', responseText);

        if (response.ok) {
            alert('Officer added successfully!');
            closeAddOfficerModal();
            
            // Improved refresh mechanism
            try {
                const officersResponse = await fetch('http://localhost:8080/api/auth/get-all-officers', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!officersResponse.ok) {
                    throw new Error('Failed to fetch updated officers');
                }

                const updatedOfficers = await officersResponse.json();
                displayOfficers(updatedOfficers);
            } catch (fetchError) {
                console.error('Error refreshing officers:', fetchError);
                alert('Officer added, but failed to refresh the list. Please reload the page.');
            }
        } else {
            // Try parsing the response as JSON, but fall back to the text if it fails
            try {
                const errorData = JSON.parse(responseText);
                alert(`Error: ${errorData.message || 'Failed to add officer'}`);
            } catch {
                alert(`Error: ${responseText || 'Failed to add officer'}`);
            }
        }
    } catch (error) {
        console.error('Add officer error:', error);
        alert('Network error. Please try again.');
    }
}
// Confirm Delete Officer
function confirmDeleteOfficer(username) {
    currentDeleteUsername = username;
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
}

// Delete Officer
async function deleteOfficer() {
    if (!currentDeleteUsername) return;

    try {
        const response = await fetch(`http://localhost:8080/api/auth/remove-officer/${currentDeleteUsername}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            alert('Officer deleted successfully!');
            document.getElementById('deleteConfirmModal').classList.add('hidden');
            fetchOfficers(); // Refresh the list
        } else {
            
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to delete officer'}`);
        }
    } catch (error) {
        console.error('Delete officer error:', error);
        alert('Network error. Please try again.');
    }
}

// Open Edit Officer Modal
function openEditOfficerModal(username) {
    const officer = currentOfficers.find(o => o.username === username);
    if (!officer) {
        alert('Officer not found');
        return;
    }

    // Populate edit form (you would need to create this modal/form)
    // Example:
    // document.getElementById('editOfficerName').value = officer.name;
    // ... other fields
}

// Fetch officers
async function fetchOfficers() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to continue');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/get-all-officers', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.group('🕵️ Officer Fetch Investigation');
        console.log('Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const officers = await response.json();
        
        console.log('Raw Officers Data:', officers);
        console.log('Total Officers Count:', officers.length);
        
        // Detailed officer logging
        officers.forEach((officer, index) => {
            console.log(`Officer ${index + 1}:`, {
                username: officer.username,
                name: officer.name,
                email: officer.email,
                department: officer.department,
                enabled: officer.enabled
            });
        });
        console.groupEnd();

        displayOfficers(officers);
    } catch (error) {
        console.error('🚨 Fetch Officers Error:', error);
        alert('Failed to load officers. Please check console for details.');
    }
}
// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add Officer Form Submission
    const addOfficerForm = document.getElementById('addOfficerForm');
    if (addOfficerForm) {
        addOfficerForm.addEventListener('submit', addNewOfficer);
    }

    // Delete Confirmation Buttons
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            deleteOfficer();
            document.getElementById('deleteConfirmModal').classList.add('hidden');
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            document.getElementById('deleteConfirmModal').classList.add('hidden');
        });
    }

    // Search and Filter
    const searchInput = document.getElementById('searchOfficers');
    const statusFilter = document.getElementById('officerStatusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterOfficers);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOfficers);
    }

    // Initial fetch
    fetchOfficers();
});

// Add this to your existing script.js file

// Open Edit Officer Modal
function openEditOfficerModal(username) {
    const officer = currentOfficers.find(o => o.username === username);
    if (!officer) {
        alert('Officer not found');
        return;
    }

    // Create edit modal if not already exists
    let editModal = document.getElementById('editOfficerModal');
    if (!editModal) {
        const modalHTML = `
        <div id="editOfficerModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="text-lg font-medium text-gray-900">Edit Admission Officer</h3>
                    <button onclick="closeEditOfficerModal()" class="text-gray-400 hover:text-gray-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mt-4">
                    <form id="editOfficerForm">
                        <input type="hidden" id="editOfficerOriginalUsername" name="originalUsername">
                        
                        <div class="mb-4">
                            <label for="editOfficerName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" id="editOfficerName" name="officerName" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        </div>
                        
                        <div class="mb-4">
                            <label for="editOfficerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" id="editOfficerEmail" name="officerEmail" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        </div>
                        
                        <div class="mb-4">
                            <label for="editOfficerUsername" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="editOfficerUsername" name="officerUsername" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        </div>
                        
                        <div class="mb-4">
                            <label for="editContact" class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input type="number" id="editContact" name="contact" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        </div>

                        <div class="mb-4">
                            <label for="editRole" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input type="text" id="editRole" name="role" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        </div>
                        
                        <div class="mb-4">
                            <label for="editOfficerDepartment" class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select id="editOfficerDepartment" name="officerDepartment" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                <option value="Computer Science">Computer Science</option>
                                <option value="Electronics & Communication">Electronics & Communication</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="editIsActive" name="isActive" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="editIsActive" class="font-medium text-gray-700">Active Status</label>
                                    <p class="text-gray-500">Set the officer as active</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" onclick="closeEditOfficerModal()" class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cancel
                            </button>
                            <button type="submit" class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <i class="fas fa-save mr-2"></i> Update Officer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Populate form with existing officer data
    document.getElementById('editOfficerOriginalUsername').value = officer.username;
    document.getElementById('editOfficerName').value = officer.name;
    document.getElementById('editOfficerEmail').value = officer.email;
    document.getElementById('editOfficerUsername').value = officer.username;
    document.getElementById('editContact').value = officer.phone;
    document.getElementById('editRole').value = officer.role;
    document.getElementById('editOfficerDepartment').value = officer.department;
    document.getElementById('editIsActive').checked = officer.enabled;

    // Show the modal
    document.getElementById('editOfficerModal').classList.remove('hidden');
    document.getElementById('editOfficerModal').addEventListener('submit',updateOfficer);
}

// Close Edit Officer Modal
function closeEditOfficerModal() {
    document.getElementById('editOfficerModal').classList.add('hidden');
}

// Update Officer
async function updateOfficer(event) {
    event.preventDefault();
    const form = event.target;
    alert("Hitt");
    const officerData = {
        originalUsername: form.originalUsername.value, // Add this hidden input
        username: form.officerUsername.value,
        email: form.officerEmail.value,
        name: form.officerName.value,
        phone: form.contact.value,
        role: form.role.value,
        department: form.officerDepartment.value,
        enabled: form.isActive.checked,
        // Optional: password update
        password: form.officerPassword ? form.officerPassword.value : ''
    };

    // Validate that no fields are empty
    const requiredFields = ['username', 'email', 'name', 'phone', 'role', 'department'];
    const missingFields = requiredFields.filter(field => !officerData[field]);

    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/update-officer', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(officerData)
        });

        const responseBody = await response.text();

        if (response.ok) {
            alert('Officer updated successfully!');
            closeEditOfficerModal();
            
            // Refresh officers list
            fetchOfficers();
        } else {
            alert(`Error: ${responseBody}`);
        }
    } catch (error) {
        console.error('Update officer error:', error);
        alert('Network error. Please try again.');
    }
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Add Officer Form Submission
    const addOfficerForm = document.getElementById('addOfficerForm');
    if (addOfficerForm) {
        addOfficerForm.addEventListener('submit', addNewOfficer);
    }

    // Delete Confirmation Buttons
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            deleteOfficer();
            document.getElementById('deleteConfirmModal').classList.add('hidden');
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            document.getElementById('deleteConfirmModal').classList.add('hidden');
        });
    }

    // Search and Filter
    const searchInput = document.getElementById('searchOfficers');
    const statusFilter = document.getElementById('officerStatusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterOfficers);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOfficers);
    }

    // Edit Officer Form Submission
    const editOfficerForm = document.getElementById('editOfficerForm');
    if (editOfficerForm) {
        editOfficerForm.addEventListener('submit', updateOfficer);
    }

    // Initial fetch
    fetchOfficers();
});