function getRollNumber() {
    const params = new URLSearchParams(window.location.search);
    return params.get('rollNumber') || '2023-CSE-0042';
}

// Append roll number to all links
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


// Global variables for authentication and data management
let userData = null;
let allSeatData = null; // Store the complete original data

// Function to check login status
function checkLoginStatus() {
    const token = localStorage.getItem('token');
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
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
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

// Updated createBranchCard function to match the desired UI
function createBranchCard(branch) {
    const categories = [
        { name: 'General', key: 'generalSeats', filled: 'filledGeneralSeats' },
        { name: 'OBC', key: 'obcSeats', filled: 'filledObcSeats' },
        { name: 'SC', key: 'scSeats', filled: 'filledScSeats' },
        { name: 'ST', key: 'stSeats', filled: 'filledStSeats' }
    ];

    // Create the HTML for the branch card
    return `
        <div class="branch-card" data-branch="${branch.branch}">
            <div class="branch-header">${branch.branch}</div>
            <div class="branch-content">
                ${categories.map(category => {
        const totalCategorySeats = branch[category.key] || 0;
        const filledCategorySeats = branch[category.filled] || 0;

        // Only show categories with seats
        if (totalCategorySeats > 0) {
            return `
                            <div class="seat-row">
                                <span class="category">${category.name}</span>
                                <span class="seats">${filledCategorySeats} / ${totalCategorySeats}</span>
                            </div>
                        `;
        }
    }).join('')}
                <div class="seat-row total">
                    <span class="category">Total Seats</span>
                    <span class="seats">${branch.totalSeats || 0}</span>
                </div>
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

document.querySelector('[data-logout-button]').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = '../Logout/index.html';
});