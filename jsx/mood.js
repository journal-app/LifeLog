// // Mood Tracker Application - FINAL WORKING VERSION

// let moodLogs = [];
// let selectedMood = null;

// // Start app
// window.onload = startMoodTracker;

// // Initialize app
// function startMoodTracker() {
//     loadMoodData();
//     setupMoodSelection();
//     setupButtons();
//     showMoodHistory();
//     updateStats();
//     generateMoodChart();
// }

// // Load data
// function loadMoodData() {
//     const saved = localStorage.getItem('lifeLogMoods');
//     moodLogs = saved ? JSON.parse(saved) : [];
// }

// // Save data
// function saveMoodData() {
//     localStorage.setItem('lifeLogMoods', JSON.stringify(moodLogs));
// }

// // Mood selection (FIXED UI UPDATE)
// function setupMoodSelection() {
//     const moodButtons = document.querySelectorAll('.mood-option');

//     moodButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             moodButtons.forEach(btn => btn.classList.remove('selected'));
//             button.classList.add('selected');

//             selectedMood = button.dataset.mood;

//             // IMMEDIATE UI FEEDBACK
//             document.getElementById('mood-today').textContent =
//                 getMoodName(selectedMood);
//         });
//     });
// }

// // Button events
// function setupButtons() {
//     document.getElementById('save-mood-btn').addEventListener('click', saveTodayMood);
//     document.getElementById('clear-mood-btn').addEventListener('click', clearMoodForm);
//     document.getElementById('time-filter').addEventListener('change', () => {
//         showMoodHistory();
//         generateMoodChart();
//     });
// }

// // Save mood
// function saveTodayMood() {
//     if (!selectedMood) {
//         alert('Please select a mood first');
//         return;
//     }

//     const notes = document.getElementById('mood-notes').value.trim();

//     const newLog = {
//         id: Date.now(),
//         mood: selectedMood,
//         notes,
//         date: new Date().toISOString()
//     };

//     moodLogs.unshift(newLog);
//     saveMoodData();

//     clearMoodForm();
//     showMoodHistory();
//     updateStats();
//     generateMoodChart();
// }

// // Clear form
// function clearMoodForm() {
//     selectedMood = null;
//     document.querySelectorAll('.mood-option')
//         .forEach(btn => btn.classList.remove('selected'));

//     document.getElementById('mood-notes').value = '';
//     document.getElementById('mood-today').textContent = '--';
// }

// // Update stats
// function updateStats() {
//     const today = new Date().toDateString();

//     const todayLog = moodLogs.find(
//         log => new Date(log.date).toDateString() === today
//     );

//     document.getElementById('mood-today').textContent =
//         todayLog ? getMoodName(todayLog.mood) : '--';

//     document.getElementById('mood-count').textContent = moodLogs.length;
//     document.getElementById('mood-streak').textContent = calculateStreak();
// }

// // Calculate streak
// function calculateStreak() {
//     let streak = 0;
//     let date = new Date();

//     for (let log of moodLogs) {
//         if (new Date(log.date).toDateString() === date.toDateString()) {
//             streak++;
//             date.setDate(date.getDate() - 1);
//         } else break;
//     }
//     return streak;
// }

// // Helpers
// function getMoodName(mood) {
//     return {
//         excellent: 'Excellent',
//         good: 'Good',
//         neutral: 'Neutral',
//         tired: 'Tired',
//         stressed: 'Stressed'
//     }[mood];
// }

// function getMoodColor(mood) {
//     return {
//         excellent: '#2ecc71',
//         good: '#3498db',
//         neutral: '#f1c40f',
//         tired: '#e67e22',
//         stressed: '#e74c3c'
//     }[mood];
// }

// function getMoodIcon(mood) {
//     return {
//         excellent: 'fa-grin-stars',
//         good: 'fa-smile',
//         neutral: 'fa-meh',
//         tired: 'fa-tired',
//         stressed: 'fa-frown'
//     }[mood];
// }

// // Render history
// function showMoodHistory() {
//     const container = document.getElementById('mood-history');
//     const filter = document.getElementById('time-filter').value;

//     let logs = [...moodLogs];

//     if (filter !== 'all') {
//         const cutoff = new Date();
//         cutoff.setDate(cutoff.getDate() - parseInt(filter));
//         logs = logs.filter(log => new Date(log.date) >= cutoff);
//     }

//     if (logs.length === 0) {
//         container.innerHTML = `
//             <div class="empty-state">
//                 <i class="fas fa-chart-line"></i>
//                 <p>No mood logs yet. Log your first mood above!</p>
//             </div>`;
//         return;
//     }

//     container.innerHTML = logs.map(log => {
//         return `
//         <div class="mood-log">
//             <div class="mood-log-info">
//                 <div class="mood-log-date">
//                     ${new Date(log.date).toLocaleString()}
//                 </div>
//                 <div class="mood-log-content">
//                     <div class="mood-log-icon" style="background:${getMoodColor(log.mood)}">
//                         <i class="fas ${getMoodIcon(log.mood)}"></i>
//                     </div>
//                     <div class="mood-log-text">${getMoodName(log.mood)}</div>
//                 </div>
//                 ${log.notes ? `<div class="mood-log-notes">${log.notes}</div>` : ''}
//             </div>
//         </div>`;
//     }).join('');
// }

// // Chart
// function generateMoodChart() {
//     const chart = document.getElementById('mood-chart');

//     if (moodLogs.length === 0) {
//         chart.innerHTML = `
//             <div class="chart-placeholder">
//                 <p>Mood data will appear here after logging</p>
//             </div>`;
//         return;
//     }

//     const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
//     let html = `<div class="chart-bar">`;

//     for (let i = 6; i >= 0; i--) {
//         const d = new Date();
//         d.setDate(d.getDate() - i);

//         const count = moodLogs.filter(
//             log => new Date(log.date).toDateString() === d.toDateString()
//         ).length;

//         html += `
//             <div class="chart-day">
//                 <div class="chart-bar-item" style="height:${count * 20}%;background:#3498db"></div>
//                 <div class="chart-day-label">${days[d.getDay()]}</div>
//             </div>`;
//     }

//     chart.innerHTML = html + `</div>`;
// }





// Mood Tracker Application - FIXED DATE FILTERING VERSION

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

// Mood selection (FIXED UI UPDATE)
function setupMoodSelection() {
    const moodButtons = document.querySelectorAll('.mood-option');

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedMood = button.dataset.mood;
            
            // IMMEDIATE UI FEEDBACK
            document.getElementById('mood-today').textContent =
                getMoodName(selectedMood);
        });
    });
}

// Button events
function setupButtons() {
    document.getElementById('save-mood-btn').addEventListener('click', saveTodayMood);
    document.getElementById('clear-mood-btn').addEventListener('click', clearMoodForm);
    document.getElementById('time-filter').addEventListener('change', () => {
        showMoodHistory();
        generateMoodChart(); // REGENERATE CHART WHEN FILTER CHANGES
    });
}

// Save mood
function saveTodayMood() {
    if (!selectedMood) {
        alert('Please select a mood first');
        return;
    }

    const notes = document.getElementById('mood-notes').value.trim();
    
    // Create new log with PROPER DATE
    const newLog = {
        id: Date.now(),
        mood: selectedMood,
        notes: notes,
        date: new Date().toISOString(), // This is correct
        // Add date-only field for easier filtering
        dateOnly: new Date().toDateString() // NEW: For easier date comparison
    };

    moodLogs.unshift(newLog);
    saveMoodData();

    clearMoodForm();
    showMoodHistory();
    updateStats();
    generateMoodChart(); // Refresh chart after saving
}

// Clear form
function clearMoodForm() {
    selectedMood = null;
    document.querySelectorAll('.mood-option')
        .forEach(btn => btn.classList.remove('selected'));

    document.getElementById('mood-notes').value = '';
    document.getElementById('mood-today').textContent = '--';
}

// Update stats
function updateStats() {
    const today = new Date().toDateString();

    const todayLog = moodLogs.find(
        log => new Date(log.date).toDateString() === today
    );

    document.getElementById('mood-today').textContent =
        todayLog ? getMoodName(todayLog.mood) : '--';

    document.getElementById('mood-count').textContent = moodLogs.length;
    document.getElementById('mood-streak').textContent = calculateStreak();
}

// Calculate streak - FIXED: Proper date comparison
function calculateStreak() {
    if (moodLogs.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    // Sort logs by date (newest first)
    const sortedLogs = [...moodLogs].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    // Check if we have a log for today
    if (new Date(sortedLogs[0].date).toDateString() === currentDate.toDateString()) {
        streak = 1;
        currentDate.setDate(currentDate.getDate() - 1);
    } else {
        return 0; // No log today = streak broken
    }
    
    // Check consecutive previous days
    for (let i = 0; i < sortedLogs.length; i++) {
        const logDate = new Date(sortedLogs[i].date).toDateString();
        const expectedDate = currentDate.toDateString();
        
        if (logDate === expectedDate) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (new Date(sortedLogs[i].date) < currentDate) {
            // We've passed the expected date without a log
            break;
        }
    }
    
    return streak;
}

// Helper functions
function getMoodName(mood) {
    const moodNames = {
        excellent: 'Excellent',
        good: 'Good',
        neutral: 'Neutral',
        tired: 'Tired',
        stressed: 'Stressed'
    };
    return moodNames[mood] || mood;
}

function getMoodColor(mood) {
    const colors = {
        excellent: '#2ecc71',
        good: '#3498db',
        neutral: '#f1c40f',
        tired: '#e67e22',
        stressed: '#e74c3c'
    };
    return colors[mood] || '#3498db';
}

function getMoodIcon(mood) {
    const icons = {
        excellent: 'fa-grin-stars',
        good: 'fa-smile',
        neutral: 'fa-meh',
        tired: 'fa-tired',
        stressed: 'fa-frown'
    };
    return icons[mood] || 'fa-smile';
}

// Get mood value for chart (1-5 scale)
function getMoodValue(mood) {
    const values = {
        excellent: 5,
        good: 4,
        neutral: 3,
        tired: 2,
        stressed: 1
    };
    return values[mood] || 3;
}

// Render history - FIXED: Proper date filtering
function showMoodHistory() {
    const container = document.getElementById('mood-history');
    const filterValue = document.getElementById('time-filter').value;

    let logsToShow = [...moodLogs];

    // Apply time filter
    if (filterValue !== 'all') {
        const days = parseInt(filterValue);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        cutoffDate.setHours(0, 0, 0, 0);
        
        logsToShow = moodLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= cutoffDate;
        });
    }

    if (logsToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>No mood logs yet. Log your first mood above!</p>
            </div>`;
        return;
    }

    // Create HTML for filtered logs
    let html = '';
    logsToShow.forEach(log => {
        const date = new Date(log.date);
        const dateStr = date.toLocaleDateString() + ' ' + 
                       date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        html += `
        <div class="mood-log">
            <div class="mood-log-info">
                <div class="mood-log-date">${dateStr}</div>
                <div class="mood-log-content">
                    <div class="mood-log-icon" style="background:${getMoodColor(log.mood)}">
                        <i class="fas ${getMoodIcon(log.mood)}"></i>
                    </div>
                    <div class="mood-log-text">${getMoodName(log.mood)}</div>
                </div>
                ${log.notes ? `<div class="mood-log-notes">${log.notes}</div>` : ''}
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

// FIXED CHART FUNCTION - PROPER DATE FILTERING
function generateMoodChart() {
    const chart = document.getElementById('mood-chart');
    const filterValue = document.getElementById('time-filter').value;

    if (moodLogs.length === 0) {
        chart.innerHTML = `
            <div class="chart-placeholder">
                <p>Mood data will appear here after logging</p>
            </div>`;
        return;
    }

    // Get logs for the selected filter period
    let logsForChart = [...moodLogs];
    
    if (filterValue !== 'all') {
        const days = parseInt(filterValue);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        cutoffDate.setHours(0, 0, 0, 0);
        
        logsForChart = moodLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= cutoffDate;
        });
    }

    // For "Last 7 Days" chart, always show 7 days even if empty
    const daysToShow = filterValue === '7' ? 7 : 
                      filterValue === '30' ? 30 : 
                      Math.min(7, logsForChart.length > 0 ? 7 : 0);

    if (daysToShow === 0) {
        chart.innerHTML = `
            <div class="chart-placeholder">
                <p>No data for selected period</p>
            </div>`;
        return;
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = `<div class="chart-bar">`;

    // Get the mood distribution for each day
    for (let i = daysToShow - 1; i >= 0; i--) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - i);
        targetDate.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);
        
        // Find moods for this specific day
        const dayMoods = logsForChart.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= targetDate && logDate < nextDate;
        });

        // Calculate average mood for the day (if any)
        let averageHeight = 0;
        let barColor = '#bdc3c7'; // Default gray for no data
        
        if (dayMoods.length > 0) {
            // Calculate average mood value (1-5 scale)
            const totalMoodValue = dayMoods.reduce((sum, log) => 
                sum + getMoodValue(log.mood), 0);
            const averageMoodValue = totalMoodValue / dayMoods.length;
            
            // Convert to percentage (1=20%, 5=100%)
            averageHeight = Math.min(100, (averageMoodValue / 5) * 100);
            
            // Use color of the most common mood for that day
            const moodCounts = {};
            dayMoods.forEach(log => {
                moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
            });
            
            const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
                moodCounts[a] > moodCounts[b] ? a : b
            );
            
            barColor = getMoodColor(mostCommonMood);
        }

        // Create bar for this day
        html += `
            <div class="chart-day">
                <div class="chart-bar-item" 
                     style="height:${averageHeight}%; background:${barColor}"
                     title="${targetDate.toLocaleDateString()}: ${
                         dayMoods.length > 0 ? 
                         `${dayMoods.length} mood(s) - Avg: ${Math.round(averageHeight)}%` : 
                         'No data'
                     }">
                </div>
                <div class="chart-day-label">${days[targetDate.getDay()]}</div>
            </div>`;
    }

    html += `</div>`;
    chart.innerHTML = html;
}

// DEBUG: Log current data structure
console.log('Mood tracker loaded. Current logs:', moodLogs);
