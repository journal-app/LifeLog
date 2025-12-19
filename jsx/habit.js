// Habit Tracker App

let habits = [];

// Start app
function startHabitApp() {
    showToday();
    loadHabits();
    setupButtons();
    showHabits();
}

// Show today's date
function showToday() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('today-date').textContent = today.toLocaleDateString('en-US', options);
}

// Load habits from localStorage
function loadHabits() {
    const saved = localStorage.getItem('lifeLogHabits');
    if (saved) {
        habits = JSON.parse(saved);
        updateStats();
    }
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('lifeLogHabits', JSON.stringify(habits));
    updateStats();
}

// Update statistics
function updateStats() {
    const today = new Date().toDateString();
    
    // Count completed today
    let completedToday = 0;
    habits.forEach(habit => {
        if (habit.dates && habit.dates[today]) {
            completedToday++;
        }
    });
    
    // Update display
    document.getElementById('completed-today').textContent = completedToday;
    document.getElementById('total-habits').textContent = habits.length;
    
    // Simple streak calculation
    let streak = 0;
    document.getElementById('streak-count').textContent = streak;
}

// Setup button events
function setupButtons() {
    // Add habit button
    document.getElementById('add-habit-btn').onclick = addNewHabit;
    
    // Clear all button
    document.getElementById('clear-all-btn').onclick = clearAllHabits;
    
    // Enter key to add habit
    document.getElementById('habit-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewHabit();
        }
    });
}

// Add new habit
function addNewHabit() {
    const nameInput = document.getElementById('habit-name');
    const name = nameInput.value.trim();
    const category = document.getElementById('habit-category').value;
    
    if (!name) {
        alert('Please enter a habit name');
        return;
    }
    
    const newHabit = {
        id: Date.now(),
        name: name,
        category: category,
        dates: {},
        createdAt: new Date().toISOString()
    };
    
    habits.push(newHabit);
    saveHabits();
    showHabits();
    
    // Clear input
    nameInput.value = '';
    
    alert('Habit added successfully!');
}

// Toggle habit completion
function toggleHabit(habitId) {
    const today = new Date().toDateString();
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit.dates) {
        habit.dates = {};
    }
    
    // Toggle for today
    if (habit.dates[today]) {
        delete habit.dates[today];
    } else {
        habit.dates[today] = true;
    }
    
    saveHabits();
    showHabits();
}

// Clear all habits
function clearAllHabits() {
    if (!confirm('Delete all habits?')) return;
    
    habits = [];
    saveHabits();
    showHabits();
    alert('All habits cleared!');
}

// Show all habits
function showHabits() {
    const container = document.getElementById('habits-list');
    const today = new Date().toDateString();
    
    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No habits yet. Add your first habit above!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    habits.forEach(habit => {
        const completedToday = habit.dates && habit.dates[today];
        
        html += `
            <div class="habit-item">
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-meta">
                        <span class="habit-category">${habit.category}</span>
                    </div>
                </div>
                <div>
                    <div class="check-btn ${completedToday ? 'checked' : ''}" 
                         onclick="toggleHabit(${habit.id})">
                        ${completedToday ? '✓' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Make function available globally
window.toggleHabit = toggleHabit;

// Start app when page loads
window.onload = startHabitApp;