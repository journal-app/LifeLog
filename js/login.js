// When page loads
window.onload = function() {
    setupLoginPage();
};

// Setup login page
function setupLoginPage() {
    // 1. Setup login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 2. Setup show password button
    document.getElementById('showPassword').addEventListener('click', togglePassword);
    
    // 3. Create demo user if needed
    createDemoUser();
}

// Handle login
function handleLogin(event) {
    event.preventDefault(); // Stop page reload
    
    // Get values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Check if empty
    if (!username || !password) {
        showError('Please fill in both fields');
        return;
    }
    
    // Try to login
    const userFound = checkUser(username, password);
    
    if (userFound) {
        // Save login
        saveLogin(username);
        // Go to journal
        goToJournal();
    } else {
        showError('Wrong username or password');
    }
}

// Check user credentials
function checkUser(username, password) {
    // Get users from localStorage
    const users = getUsers();
    
    // Look for matching user
    for (let user of users) {
        if (user.username === username && user.password === password) {
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

// Create demo user
function createDemoUser() {
    const users = getUsers();
    
    // Check if demo exists
    let demoExists = false;
    for (let user of users) {
        if (user.username === 'demo') {
            demoExists = true;
            break;
        }
    }
    
    // Create demo if not exists
    if (!demoExists) {
        users.push({
            username: 'demo',
            password: 'demo123',
            email: 'demo@lifelog.com',
            created: new Date().toISOString()
        });
        
        localStorage.setItem('lifelogUsers', JSON.stringify(users));
    }
}

// Save login status
function saveLogin(username) {
    const loginData = {
        username: username,
        loggedIn: true,
        time: new Date().toISOString()
    };
    
    localStorage.setItem('lifelogCurrentUser', JSON.stringify(loginData));
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    
    // Clear password
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
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

// Go to journal page
function goToJournal() {
    // Wait 1 second
    setTimeout(() => {
        window.location.href = 'journal.html';
    }, 1000);
}



