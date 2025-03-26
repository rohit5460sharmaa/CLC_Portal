document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active states
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Add active states
            item.classList.add('active');
            const targetSection = document.getElementById(item.dataset.target);
            targetSection.classList.add('active');
        });
    });

    // Branch Drag and Drop
    const branchList = document.getElementById('branch-list');
    const selectedBranchList = document.getElementById('selected-branch-list');
    let draggedItem = null;

    branchList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.dataTransfer.setData('text/plain', '');
        e.target.classList.add('dragging');
    });

    branchList.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });

    selectedBranchList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    selectedBranchList.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && !selectedBranchList.contains(draggedItem)) {
            selectedBranchList.appendChild(draggedItem.cloneNode(true));
            draggedItem = null;
        }
    });

    // Save Preferences
    const savePreferencesBtn = document.querySelector('.save-preferences');
    savePreferencesBtn.addEventListener('click', () => {
        const preferences = Array.from(selectedBranchList.children)
            .map(item => item.textContent);
        
        alert(`Preferences Saved: ${preferences.join(', ')}`);
        // In real app, send to backend
    });

    // File Upload
    const fileUpload = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');

    fileUpload.addEventListener('change', (e) => {
        fileList.innerHTML = ''; // Clear previous uploads
        
        Array.from(e.target.files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                <i class="ri-check-line status-icon verified"></i>
            `;
            fileList.appendChild(fileItem);
        });
    });

    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        alert('Logging out...');
        // Implement actual logout logic
    });

    // Time and Greeting
    function updateTimeAndGreeting() {
        const now = new Date();
        const hours = now.getHours();
        const currentTimeEl = document.getElementById('current-time');
        const greetingEl = document.getElementById('greeting');

        // Update time
        currentTimeEl.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Update greeting
        let greeting = 'Good Morning';
        if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
        if (hours >= 17) greeting = 'Good Evening';

        greetingEl.textContent = `${greeting}, Pratham!`;
    }

    // Initial call and then update every minute
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 60000);
});