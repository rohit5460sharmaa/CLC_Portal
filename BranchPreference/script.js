document.addEventListener('DOMContentLoaded', function () {
    const preferenceContainer = document.getElementById('preference-container');
    const addPreferenceButton = document.getElementById('add-preference');
    const resetButton = document.querySelector('.secondary-btn');
    const form = document.getElementById('preference-form');
    const branchInfoContainer = document.getElementById('branch-info');

    let usedBranches = new Set();
    let branches = []; // To store fetched branch data

    // Fetch branch data from the backend
    async function fetchBranches() {
        try {
            const response = await fetch('http://localhost:9090/api/seats/branch'); // Replace with your Spring Boot endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch branch data');
            }
            branches = await response.json();
            populateBranchInfo(branches);
            populateBranchDropdowns();
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    }

    // Populate branch info cards
    function populateBranchInfo(branches) {
        branchInfoContainer.innerHTML = branches
            .map(
                (branch) => `
            <div class="branch-card">
                <h3>${branch.name}</h3>
                <p>Available Seats: <span class="seats">${branch.availableSeats}</span></p>
                <p class="branch-code">${branch.code}</p>
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
                        ${branch.name}
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

        updateDropdowns();
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
                    ${branch.name}
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
            updateDropdowns();
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

        const preferences = [];
        const selects = preferenceContainer.querySelectorAll('.branch-select');

        selects.forEach((select, index) => {
            if (select.value) {
                const branchName = select.options[select.selectedIndex].text;
                preferences.push({
                    priority: index + 1,
                    code: select.value,
                    name: branchName,
                });
            }
        });

        if (preferences.length === 0) {
            alert('Please select at least one branch preference.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error('Failed to submit preferences');
            }

            alert('Your branch preferences have been submitted successfully!');
        } catch (error) {
            console.error('Error submitting preferences:', error);
            alert('Failed to submit preferences. Please try again.');
        }
    });

    // Initialize
    fetchBranches();
    addPreferenceButton.addEventListener('click', addPreferenceItem);
});