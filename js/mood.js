// Mood Tracker Application 

let moodLogs = [];
let selectedMood = null;

// Start app
window.onload = startMoodTracker;

// Initialize app
function startMoodTracker() {
    loadMoodData();
    setupMoodSelection();
    setupButtons();
    showMoodHistory();
    updateStats();
    generateMoodChart();
}

// Load data
function loadMoodData() {
    const saved = localStorage.getItem('lifeLogMoods');
    moodLogs = saved ? JSON.parse(saved) : [];
}

// Save data
function saveMoodData() {
    localStorage.setItem('lifeLogMoods', JSON.stringify(moodLogs));
}

