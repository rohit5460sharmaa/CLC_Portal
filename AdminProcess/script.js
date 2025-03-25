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
        const response = await fetch(`http://localhost:8080/api/auth/delete/${currentDeleteUsername}`, {
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