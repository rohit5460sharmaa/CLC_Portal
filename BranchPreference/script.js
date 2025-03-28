document.addEventListener('DOMContentLoaded', function () {
    const preferenceContainer = document.getElementById('preference-container');
    const addPreferenceButton = document.getElementById('add-preference');
    const resetButton = document.querySelector('.secondary-btn');
    const form = document.getElementById('preference-form');
    const branchInfoContainer = document.getElementById('branch-info');

    let usedBranches = new Set();
    let branches = []; // To store fetched branch data
    let studentData = null; // Store student details

    // Get roll number from URL
    function getRollNumberFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('rollNumber');
    }

    // Function to append rollNumber to links
function appendRollNumberToLinks() {
    const rollNumber = localStorage.getItem('rollNumber');
    if (!rollNumber) return;

    document.querySelectorAll('a').forEach(link => {
        const url = new URL(link.href, window.location.origin);
        url.searchParams.set('rollNumber', rollNumber);
        link.href = url.toString();
    });
}

    appendRollNumberToLinks();

    // Fetch and display student details
    async function fetchStudentAndDisplay() {
        const rollNumber = getRollNumberFromURL();
        if (!rollNumber) return;

        try {
            const response = await fetch(`http://localhost:8080/students/${rollNumber}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to fetch student data');

            studentData = await response.json();
            console.log('📌 Student Data:', studentData);

            // Display student name on the page
            document.querySelectorAll('[data-user-fullname]').forEach(el => {
                el.textContent = studentData.name || 'John Doe';
            });
        } catch (error) {
            console.error('❌ Error fetching student:', error);
            alert('Failed to load student information.');
        }
    }

    // Fetch branch data from the backend
    async function fetchBranches() {
        try {
            const response = await fetch('http://localhost:8080/api/seats', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to fetch branch data');

            branches = await response.json();
            console.log(branches);
            populateBranchInfo(branches);
            populateBranchDropdowns();
        } catch (error) {
            console.error('❌ Error fetching branches:', error);
        }
    }

    // Populate branch info cards
    function populateBranchInfo(branches) {
        branchInfoContainer.innerHTML = branches
            .map(
                (branch) => `
            <div class="branch-card">
                <h3>${branch.branch}</h3>
                <p>Available Seats: <span class="seats">${branch.vacantSeats}</span></p>
            </div>
        `
            )
            .join('');
    }

    // Populate branch dropdowns
    function populateBranchDropdowns() {
        const selects = preferenceContainer.querySelectorAll('.branch-select');
        selects.forEach((select) => {
            select.innerHTML = `
                <option value="" selected disabled>Select Branch</option>
                ${branches
                    .map(
                        (branch) => `
                    <option value="${branch.code}" ${usedBranches.has(branch.code) ? 'disabled' : ''}>
                        ${branch.branch}
                    </option>
                `
                    )
                    .join('')}
            `;
        });
    }

    // Handle dropdown change
    function handleSelectChange(event) {
        const previousValue = event.target.dataset.previousValue;
        if (previousValue) {
            usedBranches.delete(previousValue);
        }

        if (event.target.value) {
            usedBranches.add(event.target.value);
            event.target.dataset.previousValue = event.target.value;
        }
    }

    // Add a new preference item
    function addPreferenceItem() {
        const items = preferenceContainer.querySelectorAll('.preference-item');

        if (items.length >= branches.length) {
            addPreferenceButton.disabled = true;
            return;
        }

        const newItem = document.createElement('div');
        newItem.className = 'preference-item';

        const priorityNumber = document.createElement('span');
        priorityNumber.className = 'priority-number';
        priorityNumber.textContent = items.length + 1;

        const select = document.createElement('select');
        select.className = 'branch-select';
        select.required = true;

        select.innerHTML = `
            <option value="" selected disabled>Select Branch</option>
            ${branches
                .map(
                    (branch) => `
                <option value="${branch.code}" ${usedBranches.has(branch.code) ? 'disabled' : ''}>
                    ${branch.branch}
                </option>
            `
                )
                .join('')}
        `;

        select.addEventListener('change', handleSelectChange);

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-btn';
        removeButton.textContent = '×';
        removeButton.addEventListener('click', function () {
            if (select.value) {
                usedBranches.delete(select.value);
            }
            newItem.remove();
            updatePriorityNumbers();
            populateBranchDropdowns();
            addPreferenceButton.disabled = false;
        });

        newItem.appendChild(priorityNumber);
        newItem.appendChild(select);
        newItem.appendChild(removeButton);

        preferenceContainer.appendChild(newItem);

        if (items.length >= 1) {
            const allRemoveButtons = preferenceContainer.querySelectorAll('.remove-btn');
            allRemoveButtons.forEach((button) => (button.disabled = false));
        }

        if (items.length + 1 >= branches.length) {
            addPreferenceButton.disabled = true;
        }
    }

    // Update priority numbers
    function updatePriorityNumbers() {
        const items = preferenceContainer.querySelectorAll('.preference-item');
        items.forEach((item, index) => {
            item.querySelector('.priority-number').textContent = index + 1;
        });
    }

    // Handle form reset
    resetButton.addEventListener('click', function () {
        const items = preferenceContainer.querySelectorAll('.preference-item');
        for (let i = items.length - 1; i > 0; i--) {
            items[i].remove();
        }

        const firstSelect = preferenceContainer.querySelector('.branch-select');
        firstSelect.value = '';
        firstSelect.dataset.previousValue = '';

        const firstRemoveButton = preferenceContainer.querySelector('.remove-btn');
        firstRemoveButton.disabled = true;

        usedBranches.clear();
        populateBranchDropdowns();
        addPreferenceButton.disabled = false;
    });

// Handle form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!studentData) {
        alert('Student information is missing.');
        return;
    }

    const rollNumber = studentData.rollNumber; // Extract roll number

    try {
        // Check if the student has already submitted preferences
        const checkResponse = await fetch(`http://localhost:8080/api/preferences/student/${rollNumber}`);
        
        if (checkResponse.ok) {
            // Student already has preferences in the database
            const existingPreferences = await checkResponse.json();
            
            // Create selected preferences display
            let selectedPreferencesDiv = document.getElementById('selected-preferences');
            if (!selectedPreferencesDiv) {
                selectedPreferencesDiv = document.createElement('div');
                selectedPreferencesDiv.id = 'selected-preferences';
                document.body.appendChild(selectedPreferencesDiv);
            }

            // Hide preference form
            const preferenceSection = document.querySelector('#preference-form');
            if (preferenceSection) {
                preferenceSection.style.display = 'none';
            }

            // Display existing preferences
            selectedPreferencesDiv.innerHTML = `
                <h2>Your Submitted Preferences</h2>
                <div class="preference-grid">
                    ${existingPreferences.branches.map(pref => `
                        <div class="branch-card">
                            <span>${pref}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            selectedPreferencesDiv.classList.add('available-branches');

            alert('⚠️ You have already submitted your preferences.');
            return;
        }

        // If not already submitted, proceed with new preference submission
        // Collect branch preferences
        const preferences = [];
        const selects = preferenceContainer.querySelectorAll('.branch-select');
        selects.forEach((select) => {
            if (select.value) {
                preferences.push(select.options[select.selectedIndex].text);
            }
        });

        if (preferences.length === 0) {
            alert('Please select at least one branch preference.');
            return;
        }

        // Prepare request payload
        const payload = {
            rollNumber: studentData.rollNumber,
            studentName: studentData.name,
            rank: studentData.rank,
            category: studentData.category,
            branches: preferences,
        };

        // Submit new preferences
        const response = await fetch('http://localhost:8080/api/preferences/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log('📌 Response Status:', response.status);
        console.log('📌 Response Body:', responseText);

        if (!response.ok) throw new Error(`Failed to submit preferences: ${response.statusText}`);

        alert('✅ Preferences submitted successfully!');

        // Hide preference section
        const preferenceSection = document.querySelector('#preference-form');
        if (preferenceSection) {
            preferenceSection.style.display = 'none';
        }

        // Create selected preferences display
        let selectedPreferencesDiv = document.getElementById('selected-preferences');
        if (!selectedPreferencesDiv) {
            selectedPreferencesDiv = document.createElement('div');
            selectedPreferencesDiv.id = 'selected-preferences';
            document.body.appendChild(selectedPreferencesDiv);
        }

        // Display submitted preferences
        selectedPreferencesDiv.innerHTML = `
            <h2>Your Selected Preferences</h2>
            <div class="preference-grid">
                ${preferences.map(pref => `
                    <div class="branch-card">
                        <span>${pref}</span>
                    </div>
                `).join('')}
            </div>
        `;
        selectedPreferencesDiv.classList.add('available-branches');

    } catch (error) {
        console.error('❌ Error processing preferences:', error);
        alert('Failed to process preferences. Please try again.');
    }
});

    // Initialize
    fetchBranches();
    fetchStudentAndDisplay();
    addPreferenceButton.addEventListener('click', addPreferenceItem);
});

// Logout logic
document.querySelector('[data-logout-button]').addEventListener('click', function () {
    // Clear stored session (e.g., auth token)
    localStorage.clear();  // or sessionStorage.clear();

    // Redirect to the login page
    window.location.href = '../Login/login.html';
});
