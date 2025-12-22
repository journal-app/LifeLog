// Habit Tracker App
let habits = [];

// Start app
window.onload = () => {
    showToday();
    loadHabits();
    setupButtons();
    renderHabits();
};

// Show today's date
function showToday() {
    const today = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    document.getElementById('today-date').textContent = today;
}

// Load habits from localStorage
function loadHabits() {
    const saved = localStorage.getItem('lifeLogHabits');
    if (saved) habits = JSON.parse(saved);
    updateStats();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('lifeLogHabits', JSON.stringify(habits));
    updateStats();
}

// Update statistics
function updateStats() {
    const today = new Date().toDateString();
    const completedToday = habits.filter(h => h.dates?.[today]).length;
    document.getElementById('completed-today').textContent = completedToday;
    document.getElementById('total-habits').textContent = habits.length;
    document.getElementById('streak-count').textContent = 0; // placeholder streak
}

// Setup buttons
function setupButtons() {
    document.getElementById('add-habit-btn').onclick = addHabit;
    document.getElementById('clear-all-btn').onclick = clearHabits;
    document.getElementById('habit-name').addEventListener('keypress', e => { 
        if(e.key==='Enter') addHabit(); 
    });
}

// Add new habit
function addHabit() {
    const nameInput = document.getElementById('habit-name');
    const name = nameInput.value.trim();
    if (!name) return alert('Please enter a habit name');
    
    const newHabit = {
        id: Date.now(),
        name,
        category: document.getElementById('habit-category').value,
        dates: {}
    };
    
    habits.push(newHabit);
    saveHabits();
    renderHabits();
    
    nameInput.value = '';
    alert('Habit added successfully!');
}

// Toggle habit completion
function toggleHabit(id) {
    const today = new Date().toDateString();
    const habit = habits.find(h => h.id === id);
    
    if (habit.dates[today]) {
        delete habit.dates[today];
    } else {
        habit.dates[today] = true;
    }
    
    saveHabits();
    renderHabits();
}

// Clear all habits
function clearHabits() {
    if (!confirm('Delete all habits?')) return;
    habits = [];
    saveHabits();
    renderHabits();
    alert('All habits cleared!');
}

// Render habits
function renderHabits() {
    const container = document.getElementById('habits-list');
    const today = new Date().toDateString();

    if (!habits.length) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No habits yet. Add your first habit above!</p></div>`;
        return;
    }

    container.innerHTML = habits.map(habit => {
        const done = habit.dates?.[today];
        return `
            <div class="habit-item">
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-meta">
                        <span class="habit-category">${habit.category}</span>
                    </div>
                </div>
                <div class="check-btn ${done ? 'checked' : ''}" onclick="toggleHabit(${habit.id})">${done?'✓':''}</div>
            </div>
        `;
    }).join('');
}

// Make toggle globally available
window.toggleHabit = toggleHabit;
