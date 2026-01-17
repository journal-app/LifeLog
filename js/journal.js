// Journal App
let entries = [];

// Start app
function startApp() {
    showToday();
    loadData();
    setupButtons();
    showEntries();
}

// Show today's date
function showToday() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', options);
}

// Load saved data
function loadData() {
    const saved = localStorage.getItem('journalEntries');
    if (saved) {
        entries = JSON.parse(saved);
        updateCount();
    }
}

// Save data
function saveData() {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    updateCount();
}

// Update entry count
function updateCount() {
    document.getElementById('total-entries').textContent = entries.length;
}

// Setup buttons
function setupButtons() {
    document.getElementById('save-btn').onclick = saveEntry;
    document.getElementById('clear-btn').onclick = clearForm;
    document.getElementById('search-btn').onclick = searchEntries;
    
    // Character counter
    document.getElementById('entry-content').addEventListener('input', function() {
        document.getElementById('char-count').textContent = this.value.length;
    });
    
    // Enter to search
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchEntries();
        }
    });
    
    // Ctrl+Enter to save
    document.getElementById('entry-content').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            saveEntry();
        }
    });
}

