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

// Save new entry
function saveEntry() {
    const title = document.getElementById('entry-title').value.trim();
    const content = document.getElementById('entry-content').value.trim();
    const mood = document.getElementById('entry-mood').value;
    
    if (!title || !content) {
        alert('Please write title and content');
        return;
    }
    
    const newEntry = {
        id: Date.now(),
        title: title,
        content: content,
        mood: mood,
        date: new Date().toISOString()
    };
    
    entries.unshift(newEntry);
    saveData();
    showEntries();
    clearForm();
    alert('Entry saved!');
}

// Clear form
function clearForm() {
    document.getElementById('entry-title').value = '';
    document.getElementById('entry-content').value = '';
    document.getElementById('char-count').textContent = '0';
}

// Search entries
function searchEntries() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    showEntries(searchText);
}

// Show entries
function showEntries(searchText = '') {
    const container = document.getElementById('entries-list');
    container.innerHTML = '';
    
    let filtered = entries;
    
    if (searchText) {
        filtered = entries.filter(entry => 
            entry.title.toLowerCase().includes(searchText) || 
            entry.content.toLowerCase().includes(searchText)
        );
    }
    
    if (filtered.length === 0) {
        let message = '<div class="empty-state">';
        message += '<i class="fas fa-search"></i>';
        message += '<p>' + (searchText ? 'No matching entries' : 'No entries yet') + '</p>';
        message += '</div>';
        container.innerHTML = message;
        return;
    }
    
    filtered.forEach(entry => {
        container.appendChild(createEntryCard(entry));
    });
}

// Create entry card
function createEntryCard(entry) {
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const shortContent = entry.content.length > 150 ? 
        entry.content.substring(0, 150) + '...' : entry.content;
    
    const div = document.createElement('div');
    div.className = 'entry-card';
    div.innerHTML = `
        <div class="entry-header">
            <div class="entry-title">${entry.title}</div>
            <div class="entry-date">${dateStr}</div>
        </div>
        <div class="entry-content">${shortContent}</div>
        <div class="entry-actions">
            <button class="delete-btn" onclick="deleteEntry(${entry.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return div;
}

// Delete entry
function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return;
    
    entries = entries.filter(entry => entry.id !== id);
    saveData();
    showEntries();
    alert('Entry deleted');
}

// Make delete function available
window.deleteEntry = deleteEntry;

// Start app when page loads
window.onload = startApp;