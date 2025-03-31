document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
});

async function login() {
    const userType = document.getElementById('userType').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Comprehensive Input Validation
    if (!username || !password || !userType) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                userType: userType
            })
        });

        // Detailed Error Handling
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login Error:', response.status, errorText);
            
            switch(response.status) {
                case 401:
                    alert('Invalid credentials. Please check your username, password, and user type.');
                    break;
                case 403:
                    alert('Access forbidden. Check your permissions.');
                    break;
                case 500:
                    alert('Server error. Please try again later.');
                    break;
                default:
                    alert(`Login failed: ${errorText}`);
            }
            return;
        }

        const data = await response.json();
        console.log('Login Response:', data);

        // Validate Response
        if (!data.token || !data.userType || !data.username) {
            throw new Error('Invalid server response');
        }

        // Store Authentication Data
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userType', data.userType);

        // Redirect Based on User Type
        const redirectMap = {
            'student': '../StudentDashboard.html',
            'officer': '../OfficerDashboard/index.html',
            'admin': '../AdminProcess/admin.html'
        };

        const redirectUrl = redirectMap[data.userType.toLowerCase()];
        
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            throw new Error('Unknown user type');
        }

    } catch (error) {
        console.error('Login Process Error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}