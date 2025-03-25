// JavaScript for Category-wise Counselling Page

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterForm = document.getElementById('filter-form');
    const addCategoryBtn = document.getElementById('add-category');
    const editQuotasBtn = document.getElementById('edit-quotas');
    const exportDataBtn = document.getElementById('export-data');
    const editModal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const viewBtns = document.querySelectorAll('.view-btn');

    // Apply Filters
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const academicYear = document.getElementById('academic-year').value;
        const program = document.getElementById('program').value;
        const department = document.getElementById('department').value;
        
        console.log('Filters applied:', { academicYear, program, department });
        // In a real application, this would fetch data based on the filters
        
        // Simulate loading
        simulateLoading();
    });

    // Add Category Button
    addCategoryBtn.addEventListener('click', function() {
        console.log('Add Category clicked');
        // Open a modal or form to add a new category
        alert('Add Category feature will be implemented in the next phase.');
    });

    // Edit Quotas Button
    editQuotasBtn.addEventListener('click', function() {
        console.log('Edit Quotas clicked');
        // Open a modal to edit all quotas at once
        alert('Edit All Quotas feature will be implemented in the next phase.');
    });

    // Export Data Button
    exportDataBtn.addEventListener('click', function() {
        console.log('Export Data clicked');
        // Generate CSV or Excel file
        alert('Data export initiated. Your file will be ready for download shortly.');
    });

    // Open Edit Modal
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const category = row.cells[0].textContent;
            const totalSeats = row.cells[1].textContent;
            
            // Set values in the modal
            document.getElementById('category-name').value = category;
            document.getElementById('total-seats').value = totalSeats;
            
            // Show the modal
            editModal.style.display = 'block';
        });
    });

    // View Details
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const category = row.cells[0].textContent;
            
            console.log('View details for:', category);
            // In a real application, this would navigate to a detailed view
            alert(`Detailed view for ${category} category will be implemented in the next phase.`);
        });
    });

    // Close Modal
    closeBtn.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Cancel Button in Modal
    cancelBtn.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Save Changes Button in Modal
    document.getElementById('edit-category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = document.getElementById('category-name').value;
        const totalSeats = document.getElementById('total-seats').value;
        const allocationPercent = document.getElementById('allocation-percent').value;
        
        console.log('Saving changes for:', { category, totalSeats, allocationPercent });
        // In a real application, this would update the data
        
        // Close the modal
        editModal.style.display = 'none';
        
        // Show success message
        showNotification('Category quota updated successfully!', 'success');
        
        // Update UI (for demo purposes)
        updateTable(category, totalSeats);
    });

    // Close Modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Simulate loading data (for demo purposes)
    function simulateLoading() {
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading data...</td></tr>';
        
        setTimeout(() => {
            // Reload the original data after a delay
            // In a real application, this would be replaced with actual filtered data
            tableBody.innerHTML = `
                <tr>
                    <td>General</td>
                    <td>250</td>
                    <td>180</td>
                    <td>70</td>
                    <td>15</td>
                    <td>
                        <button class="action-btn view-btn">View</button>
                        <button class="action-btn edit-btn">Edit</button>
                    </td>
                </tr>
                <tr>
                    <td>OBC</td>
                    <td>135</td>
                    <td>90</td>
                    <td>45</td>
                    <td>12</td>
                    <td>
                        <button class="action-btn view-btn">View</button>
                        <button class="action-btn edit-btn">Edit</button>
                    </td>
                </tr>
                <tr>
                    <td>SC</td>
                    <td>75</td>
                    <td>45</td>
                    <td>30</td>
                    <td>8</td>
                    <td>
                        <button class="action-btn view-btn">View</button>
                        <button class="action-btn edit-btn">Edit</button>
                    </td>
                </tr>
                <tr>
                    <td>ST</td>
                    <td>40</td>
                    <td>10</td>
                    <td>30</td>
                    <td>7</td>
                    <td>
                        <button class="action-btn view-btn">View</button>
                        <button class="action-btn edit-btn">Edit</button>
                    </td>
                </tr>
            `;
            
            // Reattach event listeners to new buttons
            const newEditBtns = document.querySelectorAll('.edit-btn');
            const newViewBtns = document.querySelectorAll('.view-btn');
            
            newEditBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const category = row.cells[0].textContent;
                    const totalSeats = row.cells[1].textContent;
                    
                    // Set values in the modal
                    document.getElementById('category-name').value = category;
                    document.getElementById('total-seats').value = totalSeats;
                    
                    // Show the modal
                    editModal.style.display = 'block';
                });
            });
            
            newViewBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const category = row.cells[0].textContent;
                    
                    alert(`Detailed view for ${category} category will be implemented in the next phase.`);
                });
            });
            
            showNotification('Data updated successfully!', 'success');
        }, 1000);
    }

    // Update table after editing (for demo purposes)
    function updateTable(category, totalSeats) {
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            if (row.cells[0].textContent === category) {
                row.cells[1].textContent = totalSeats;
                
                // Update available seats based on new total (for demo purposes)
                const allocated = parseInt(row.cells[2].textContent);
                const available = parseInt(totalSeats) - allocated;
                row.cells[3].textContent = available;
                
                // Update bar chart
                updateBarChart(category, parseInt(totalSeats));
            }
        });
    }

    // Update bar chart (for demo purposes)
    function updateBarChart(category, totalSeats) {
        const barFills = document.querySelectorAll('.bar-fill');
        
        barFills.forEach(bar => {
            if (bar.getAttribute('data-category') === category) {
                // Calculate new height percentage based on total seats
                // This is a simplified calculation for demo purposes
                const newHeight = Math.min(90, (totalSeats / 3) * 0.9);
                bar.style.height = `${newHeight}%`;
            }
        });
    }

    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.color = '#fff';
        notification.style.zIndex = '1000';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4caf50';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
        } else {
            notification.style.backgroundColor = '#3f51b5';
        }
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize animated bar chart
    initializeBarChart();
    function initializeBarChart() {
        const barFills = document.querySelectorAll('.bar-fill');
        
        // Initially set all heights to 0%
        barFills.forEach(bar => {
            bar.style.height = '0%';
        });
        
        // Animate to actual heights
        setTimeout(() => {
            barFills.forEach(bar => {
                const dataCategory = bar.getAttribute('data-category');
                let targetHeight = '25%';
                
                if (dataCategory === 'General') targetHeight = '72%';
                if (dataCategory === 'OBC') targetHeight = '67%';
                if (dataCategory === 'SC') targetHeight = '60%';
                if (dataCategory === 'ST') targetHeight = '25%';
                
                bar.style.height = targetHeight;
            });
        }, 300);
    }
});