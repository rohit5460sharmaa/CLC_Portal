// script.js

function register() {
    // Get form data
    const rollNumber = document.getElementById('rollNumber').value;
    const name = document.getElementById('fullName').value;
    const rank = parseInt(document.getElementById('rank').value);
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const fatherName = document.getElementById('fatherName').value;
    const dob = document.getElementById('dob').value;
    const category = document.getElementById('category').value.toUpperCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAgree = document.getElementById('termsAgree').checked;

    // Validate inputs
    if (!rollNumber || !name || !rank || !email || !phone || !address || !fatherName || !dob || !category || !password) {
        alert('Please fill in all required fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (!termsAgree) {
        alert('You must agree to the Terms and Conditions');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Create student object
    const studentData = {
        rollNumber: rollNumber,
        name: name,
        rank: rank,
        email: email,
        phone: phone,
        address: address,
        fatherName: fatherName,
        dob: dob,
        category: category,
        password: password,
        admitted: false
    };

    // Show loading state
    const registerButton = document.querySelector('button[type="button"]');
    const originalButtonText = registerButton.textContent;
    registerButton.textContent = 'Registering...';
    registerButton.disabled = true;

    // Send data to backend
    fetch('http://localhost:8080/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => {
        if (!response.ok) {
            // Check for specific error types
            if (response.status === 409) {
                throw new Error('Student with this roll number or email already exists');
            }
            throw new Error('Registration failed: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Registration successful:', data);
        alert('Registration successful! You can now login with your roll number and password.');
        window.location.href = '../Login/login.html'; // Redirect to login page
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Registration failed. Please try again.');
    })
    .finally(() => {
        // Restore button state
        registerButton.textContent = originalButtonText;
        registerButton.disabled = false;
    });
}

// Add validation listeners
document.addEventListener('DOMContentLoaded', function() {
    // Password match validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
        } else {
            confirmPassword.setCustomValidity('');
        }
    });

    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
});