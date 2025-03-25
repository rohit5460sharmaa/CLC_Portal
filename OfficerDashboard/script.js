<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    document.addEventListener('DOMContentLoaded', function() {
        // Navigation Links
        const links = [
            { id: 'dashboard-link', section: 'dashboard' },
            { id: 'seat-management-link', section: 'seat-management' },
            { id: 'student-queue-link', section: 'student-queue' },
            { id: 'reports-link', section: 'reports' }
        ];

        links.forEach(link => {
            document.getElementById(link.id).addEventListener('click', function(e) {
                e.preventDefault();
                // Hide all sections
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.add('hidden');
                });
                // Show selected section
                document.getElementById(link.section).classList.remove('hidden');
            });
        });

        // Branch and Seat Management
        const branchSeatForm = document.getElementById('branch-seat-form');
        const seatMatrixBody = document.getElementById('seat-matrix-body');

        branchSeatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const branchName = document.getElementById('branch-name').value;
            const totalSeats = document.getElementById('total-seats').value;
            const genSeats = document.getElementById('gen-seats').value;
            const scSeats = document.getElementById('sc-seats').value;
            const stSeats = document.getElementById('st-seats').value;
            const obcSeats = document.getElementById('obc-seats').value;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${branchName}</td>
                <td class="px-4 py-2">${totalSeats}</td>
                <td class="px-4 py-2">${genSeats}</td>
                <td class="px-4 py-2">${scSeats}</td>
                <td class="px-4 py-2">${stSeats}</td>
                <td class="px-4 py-2">${obcSeats}</td>
                <td class="px-4 py-2">
                    <button class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            seatMatrixBody.appendChild(row);

            // Reset form
            branchSeatForm.reset();
        });

        // Simulated student queue
        const students = [
            { 
                name: 'Pratham Joya', 
                rank: 1, 
                category: 'General', 
                branches: ['Computer Science', 'Electronics'] 
            },
            { 
                name: 'John Doe', 
                rank: 2, 
                category: 'SC', 
                branches: ['Mechanical', 'Civil'] 
            }
        ];

        let currentStudentIndex = 0;

        function updateCurrentStudent() {
            if (currentStudentIndex < students.length) {
                const student = students[currentStudentIndex];
                document.getElementById('student-name').textContent = student.name;
                document.getElementById('student-rank').textContent = student.rank;
                document.getElementById('student-category').textContent = student.category;
                document.getElementById('student-branches').textContent = student.branches.join(', ');
            } else {
                // No more students
                document.getElementById('student-name').textContent = 'No more students';
                document.getElementById('student-rank').textContent = '-';
                document.getElementById('student-category').textContent = '-';
                document.getElementById('student-branches').textContent = '-';
            }
        }

        document.getElementById('admit-btn').addEventListener('click', () => {
            currentStudentIndex++;
            updateCurrentStudent();
        });

        document.getElementById('skip-btn').addEventListener('click', () => {
            currentStudentIndex++;
            updateCurrentStudent();
        });

        // Initial setup
        updateCurrentStudent();

        // Charts (using Chart.js)
        const seatOccupancyCtx = document.getElementById('seat-occupancy-chart').getContext('2d');
        new Chart(seatOccupancyCtx, {
            type: 'pie',
            data: {
                labels: ['Computer Science', 'Electronics', 'Mechanical', 'Civil'],
                datasets: [{
                    label: 'Seat Occupancy',
                    data: [30, 25, 20, 25],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(79, 70, 229, 0.7)',
                        'rgba(129, 140, 248, 0.7)',
                        'rgba(165, 180, 252, 0.7)'
                    ]
                }]
            }
        });

        const categoryAdmissionCtx = document.getElementById('category-admission-chart').getContext('2d');
        new Chart(categoryAdmissionCtx, {
            type: 'bar',
            data: {
                labels: ['General', 'SC', 'ST', 'OBC'],
                datasets: [{
                    label: 'Admissions',
                    data: [40, 15, 10, 20],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(79, 70, 229, 0.7)',
                        'rgba(129, 140, 248, 0.7)',
                        'rgba(165, 180, 252, 0.7)'
                    ]
                }]
            }
        });

        // Branch Occupancy Cards
        function createBranchOccupancyCards() {
            const branchOccupancyGrid = document.getElementById('branch-occupancy-grid');
            const branchDetailsPopup = document.getElementById('branch-details-popup');
            const closeBranchDetailsBtn = document.getElementById('close-branch-details');

            // Sample branch data (replace with your actual data)
            const branchData = [
                {
                    name: 'Computer Science',
                    totalSeats: 120,
                    occupiedSeats: 90,
                    categories: {
                        general: 50,
                        sc: 15,
                        st: 10,
                        obc: 15
                    }
                },
                {
                    name: 'Electronics',
                    totalSeats: 100,
                    occupiedSeats: 75,
                    categories: {
                        general: 40,
                        sc: 12,
                        st: 8,
                        obc: 15
                    }
                },
                {
                    name: 'Mechanical',
                    totalSeats: 90,
                    occupiedSeats: 60,
                    categories: {
                        general: 35,
                        sc: 10,
                        st: 5,
                        obc: 10
                    }
                },
                {
                    name: 'Civil',
                    totalSeats: 80,
                    occupiedSeats: 55,
                    categories: {
                        general: 30,
                        sc: 8,
                        st: 7,
                        obc: 10
                    }
                }
            ];

            branchData.forEach(branch => {
                // Create branch card
                const branchCard = document.createElement('div');
                branchCard.className = 'bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all';
                
                // Calculate occupancy percentage
                const occupancyPercentage = Math.round((branch.occupiedSeats / branch.totalSeats) * 100);
                
                branchCard.innerHTML = `
                    <h4 class="text-lg font-semibold mb-2 text-indigo-800">${branch.name}</h4>
                    <div class="mb-2">
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${occupancyPercentage}%"></div>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span>Occupied: ${branch.occupiedSeats}/${branch.totalSeats}</span>
                        <span class="font-bold text-indigo-600">${occupancyPercentage}%</span>
                    </div>
                `;

                // Add click event to show details
                branchCard.addEventListener('click', () => {
                    document.getElementById('popup-branch-name').textContent = branch.name;
                    document.getElementById('popup-total-seats').textContent = branch.totalSeats;
                    document.getElementById('popup-general-seats').textContent = branch.categories.general;
                    document.getElementById('popup-sc-seats').textContent = branch.categories.sc;
                    document.getElementById('popup-st-seats').textContent = branch.categories.st;
                    document.getElementById('popup-obc-seats').textContent = branch.categories.obc;
                    
                    branchDetailsPopup.classList.remove('hidden');
                });

                branchOccupancyGrid.appendChild(branchCard);
            });

            // Close popup event
            closeBranchDetailsBtn.addEventListener('click', () => {
                branchDetailsPopup.classList.add('hidden');
            });

            // Close popup when clicking outside
            branchDetailsPopup.addEventListener('click', (e) => {
                if (e.target === branchDetailsPopup) {
                    branchDetailsPopup.classList.add('hidden');
                }
            });
        }

        // Call branch occupancy function
        createBranchOccupancyCards();

        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', () => {
            alert('Logged out successfully');
            // Implement actual logout logic
        });
    });
