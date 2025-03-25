document.addEventListener('DOMContentLoaded', function() {
    // Sample data for admission officers
    const officers = [
        { id: 1, name: 'John Doe', email: 'john.doe@clcportal.com', phone: '123-456-7890', department: 'Computer Science', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@clcportal.com', phone: '234-567-8901', department: 'Electronics & Communication', status: 'active' },
        { id: 3, name: 'Robert Johnson', email: 'robert.johnson@clcportal.com', phone: '345-678-9012', department: 'Mechanical Engineering', status: 'inactive' },
        { id: 4, name: 'Emily Davis', email: 'emily.davis@clcportal.com', phone: '456-789-0123', department: 'Civil Engineering', status: 'active' }
    ];
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside of it
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // Variables for modals and forms
    const deleteModal = document.getElementById('deleteModal');
    const editModal = document.getElementById('editModal');
    const toast = document.getElementById('toast');
    let currentOfficerId = null;
    
    // Initialize table with data
    updateOfficersTable();
    
    // Add form submission
    document.getElementById('addOfficerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('officer-name').value;
        const email = document.getElementById('officer-email').value;
        const phone = document.getElementById('officer-phone').value;
        const dept = document.getElementById('officer-dept').value;
        
        // Simulate adding a new officer
        officers.push({
            id: officers.length + 1,
            name: name,
            email: email,
            phone: phone,
            department: getDepartmentName(dept),
            status: 'active'
        });
        
        // Reset form
        this.reset();
        
        // Refresh table
        updateOfficersTable();
        
        // Show toast
        showToast('Admission officer added successfully!');
    });
    
    // Delete officer buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-officer')) {
            currentOfficerId = parseInt(e.target.getAttribute('data-id'));
            deleteModal.classList.add('active');
        }
    });
    
    // Edit officer buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-officer')) {
            currentOfficerId = parseInt(e.target.getAttribute('data-id'));
            const officer = officers.find(o => o.id === currentOfficerId);
            
            document.getElementById('edit-officer-id').value = officer.id;
            document.getElementById('edit-officer-name').value = officer.name;
            document.getElementById('edit-officer-email').value = officer.email;
            document.getElementById('edit-officer-phone').value = officer.phone;
            document.getElementById('edit-officer-dept').value = getDepartmentCode(officer.department);
            document.getElementById('edit-officer-status').value = officer.status;
            
            editModal.classList.add('active');
        }
    });
    
    // Close modals
    document.querySelectorAll('.close-modal, #cancelDelete, #cancelEdit').forEach(button => {
        button.addEventListener('click', function() {
            deleteModal.classList.remove('active');
            editModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('active');
        }
        if (e.target === editModal) {
            editModal.classList.remove('active');
        }
    });
    
    // Confirm delete
    document.getElementById('confirmDelete').addEventListener('click', function() {
        const index = officers.findIndex(o => o.id === currentOfficerId);
        if (index !== -1) {
            officers.splice(index, 1);
            updateOfficersTable();
            showToast('Admission officer removed successfully!');
        }
        deleteModal.classList.remove('active');
    });
    
    // Save edit
    document.getElementById('saveEdit').addEventListener('click', function() {
        const officer = officers.find(o => o.id === currentOfficerId);
        if (officer) {
            officer.name = document.getElementById('edit-officer-name').value;
            officer.email = document.getElementById('edit-officer-email').value;
            officer.phone = document.getElementById('edit-officer-phone').value;
            officer.department = getDepartmentName(document.getElementById('edit-officer-dept').value);
            officer.status = document.getElementById('edit-officer-status').value;
            
            updateOfficersTable();
            showToast('Admission officer updated successfully!');
        }
        editModal.classList.remove('active');
    });
    
    // Handle escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            deleteModal.classList.remove('active');
            editModal.classList.remove('active');
        }
    });
    
    // Function to update officers table
    function updateOfficersTable() {
        const tbody = document.getElementById('officersTableBody');
        tbody.innerHTML = '';
        
        officers.forEach(officer => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="Name">${officer.name}</td>
                <td data-label="Email">${officer.email}</td>
                <td data-label="Department">${officer.department}</td>
                <td data-label="Status"><span class="badge badge-${officer.status === 'active' ? 'success' : 'warning'}">${capitalizeFirstLetter(officer.status)}</span></td>
                <td data-label="Actions" class="action-btns">
                    <button class="btn btn-sm btn-primary edit-officer" data-id="${officer.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-officer" data-id="${officer.id}">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Update stats
        const statsElements = document.querySelectorAll('.stats-cards .stat-value');
        if (statsElements.length > 0) {
            statsElements[0].textContent = officers.length;
        }
        if (statsElements.length > 1) {
            statsElements[1].textContent = officers.filter(o => o.status === 'active').length;
        }
    }
    
    // Helper functions
    function getDepartmentName(code) {
        const depts = {
            'CS': 'Computer Science',
            'ECE': 'Electronics & Communication',
            'ME': 'Mechanical Engineering',
            'CE': 'Civil Engineering',
            'EE': 'Electrical Engineering'
        };
        return depts[code] || code;
    }
    
    function getDepartmentCode(name) {
        const codes = {
            'Computer Science': 'CS',
            'Electronics & Communication': 'ECE',
            'Mechanical Engineering': 'ME',
            'Civil Engineering': 'CE',
            'Electrical Engineering': 'EE'
        };
        return codes[name] || '';
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
});