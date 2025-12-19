// Signup Page - Simple & Clean

// When page loads
window.onload = function() {
    setupSignupPage();
};

// Setup signup page
function setupSignupPage() {
    // 1. Setup signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // 2. Setup show password button
    document.getElementById('showPassword').addEventListener('click', togglePassword);
}

// Handle signup
function handleSignup(event) {
    event.preventDefault(); // Stop page reload
    
    // Get values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Hide old messages
    hideMessages();
    
    // Validate inputs
    const validation = validateInputs(username, email, password, confirmPassword);
    
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    // Check if username exists
    if (usernameExists(username)) {
        showError('Username already taken');
        return;
    }
    
    // Create new user
    createUser(username, email, password);
    
    // Show success
    showSuccess();
    
    // Go to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Validate inputs
function validateInputs(username, email, password, confirmPassword) {
    // Check username
    if (username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' };
    }
    
    if (username.length > 20) {
        return { valid: false, message: 'Username must be less than 20 characters' };
    }
    
    // Check email
    if (!email.includes('@') || !email.includes('.')) {
        return { valid: false, message: 'Please enter a valid email' };
    }
    
    // Check password
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    // Check passwords match
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }
    
    return { valid: true, message: '' };
}

// Check if username exists
function usernameExists(username) {
    const users = getUsers();
    
    for (let user of users) {
        if (user.username === username) {
            return true;
        }
    }
    
    return false;
}

// Get users from localStorage
function getUsers() {
    const saved = localStorage.getItem('lifelogUsers');
    return saved ? JSON.parse(saved) : [];
}

// Create new user
function createUser(username, email, password) {
    // Get existing users
    const users = getUsers();
    
    // Add new user
    users.push({
        username: username,
        email: email,
        password: password,
        created: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('lifelogUsers', JSON.stringify(users));
    
    console.log('New user created:', username);
}

// Hide messages
function hideMessages() {
    document.getElementById('signupSuccess').style.display = 'none';
    document.getElementById('signupError').style.display = 'none';
}

// Show error
function showError(message) {
    const errorDiv = document.getElementById('signupError');
    const errorText = document.getElementById('signupErrorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
}

// Show success
function showSuccess() {
    document.getElementById('signupSuccess').style.display = 'flex';
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('#showPassword i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}