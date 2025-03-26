document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
});

/**
 * Handles the login process
 */

async function login() {
    const userType = document.getElementById('userType').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log('Username:', username);
console.log('Password:', password);
console.log('UserType:', userType);

    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                userType: userType
            })
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();

        console.log('Full Response:', data);

        // Debugging Logs
        console.log('Login Response:', data);
        console.log('Token:', data.token);
        console.log('User Type:', data.userType);
        
        // Save token and user info to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userType', data.userType);
        
             // Redirect based on userType
             if (data.userType) {
                let redirectUrl = '';
    
                switch (data.userType.toLowerCase()) {
                    case 'student':
                        redirectUrl = '../StudentDashboard.html';
                        break;
                    case 'officer':
                        redirectUrl = '../OfficerDashboard/index.html';
                        break;
                    case 'admin':
                        redirectUrl = '../AdminProcess/admin.html';
                        break;
                    default:
                        console.error('Unknown userType:', data.userType);
                        alert('Unknown user type');
                        return;
                }
    
                console.log('Redirecting to:', redirectUrl);
                window.location.replace(redirectUrl);
            } else {
                alert('User type is missing in the response.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Invalid credentials or server error. Please try again.');
        }
    }