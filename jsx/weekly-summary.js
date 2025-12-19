// Weekly Summary Application
// This page aggregates data from all other LifeLog pages

let currentWeekOffset = 0; // 0 = current week, -1 = previous week, etc.

// Start app when page loads
window.onload = function() {
    startWeeklySummary();
};

// Main function
function startWeeklySummary() {
    setupWeekNavigation(); // Setup week buttons
    loadWeeklyData();      // Load and display data
    updateWeekDisplay();   // Show current week
}

// Setup week navigation buttons
function setupWeekNavigation() {
    document.getElementById('prev-week').addEventListener('click', function() {
        currentWeekOffset--;
        updateWeekDisplay();
        loadWeeklyData();
    });
    
    document.getElementById('current-week').addEventListener('click', function() {
        currentWeekOffset = 0;
        updateWeekDisplay();
        loadWeeklyData();
    });
    
    document.getElementById('next-week').addEventListener('click', function() {
        currentWeekOffset++;
        updateWeekDisplay();
        loadWeeklyData();
    });
}

// Update week display text
function updateWeekDisplay() {
    const weekDisplay = document.getElementById('week-display');
    const weekStart = getWeekStartDate(currentWeekOffset);
    const weekEnd = getWeekEndDate(currentWeekOffset);
    
    if (currentWeekOffset === 0) {
        weekDisplay.textContent = 'This Week';
    } else if (currentWeekOffset === -1) {
        weekDisplay.textContent = 'Last Week';
    } else if (currentWeekOffset < -1) {
        weekDisplay.textContent = `${Math.abs(currentWeekOffset)} Weeks Ago`;
    } else {
        weekDisplay.textContent = `Week ${currentWeekOffset + 1}`;
    }
    
    // Update button states
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('current-week').classList.add('active');
}

// Get start date of the week (Sunday)
function getWeekStartDate(weekOffset) {
    const date = new Date();
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    date.setDate(date.getDate() - day + (weekOffset * 7));
    date.setHours(0, 0, 0, 0);
    return date;
}

// Get end date of the week (Saturday)
function getWeekEndDate(weekOffset) {
    const start = getWeekStartDate(weekOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}

// Main function to load and display all data
function loadWeeklyData() {
    const weekStart = getWeekStartDate(currentWeekOffset);
    const weekEnd = getWeekEndDate(currentWeekOffset);
    
    // Load data from all modules
    const journalData = loadJournalData(weekStart, weekEnd);
    const moodData = loadMoodData(weekStart, weekEnd);
    const habitData = loadHabitData(weekStart, weekEnd);
    const taskData = loadTaskData(weekStart, weekEnd);
    
    // Update statistics
    updateStats(journalData, moodData, habitData, taskData);
    
    // Display data in each section
    displayJournalSummary(journalData);
    displayMoodSummary(moodData);
    displayHabitSummary(habitData);
    displayTaskSummary(taskData);
    
    // Generate insights
    generateInsights(journalData, moodData, habitData, taskData);
}

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

// Load journal entries for the week
function loadJournalData(weekStart, weekEnd) {
    // Try to load from localStorage (matching your journal.js)
    const saved = localStorage.getItem('journalEntries');
    let entries = [];
    
    if (saved) {
        entries = JSON.parse(saved);
    }
    
    // Filter entries for current week
    const weekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    console.log('Found', weekEntries.length, 'journal entries this week');
    return weekEntries;
}

// Load mood logs for the week
function loadMoodData(weekStart, weekEnd) {
    // Try to load from localStorage (matching your mood.js)
    const saved = localStorage.getItem('lifeLogMoods');
    let moods = [];
    
    if (saved) {
        moods = JSON.parse(saved);
    }
    
    // Filter moods for current week
    const weekMoods = moods.filter(mood => {
        const moodDate = new Date(mood.date);
        return moodDate >= weekStart && moodDate <= weekEnd;
    });
    
    console.log('Found', weekMoods.length, 'mood logs this week');
    return weekMoods;
}

// Load habit data for the week
function loadHabitData(weekStart, weekEnd) {
    // Try to load from localStorage (matching habit.js pattern)
    // Note: You'll need to implement habit.js similarly
    const saved = localStorage.getItem('lifeLogHabits');
    let habits = [];
    
    if (saved) {
        habits = JSON.parse(saved);
    }
    
    // For demo: Create sample habit data if none exists
    if (habits.length === 0) {
        habits = [
            { id: 1, name: 'Morning Exercise', checked: 4, total: 7 },
            { id: 2, name: 'Read Book', checked: 5, total: 7 },
            { id: 3, name: 'Meditation', checked: 3, total: 7 }
        ];
    }
    
    console.log('Loaded', habits.length, 'habits');
    return habits;
}

// Load task data for the week
function loadTaskData(weekStart, weekEnd) {
    // Try to load from localStorage (matching your todo.js)
    const saved = localStorage.getItem('lifeLogTasks');
    let tasks = [];
    
    if (saved) {
        tasks = JSON.parse(saved);
    }
    
    // Filter tasks for current week and completed
    const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
    });
    
    console.log('Found', weekTasks.length, 'tasks this week');
    return weekTasks;
}

// ============================================
// STATISTICS UPDATE
// ============================================

// Update all statistics
function updateStats(journalData, moodData, habitData, taskData) {
    // Journal count
    document.getElementById('journal-count').textContent = journalData.length;
    
    // Mood count
    document.getElementById('mood-count').textContent = moodData.length;
    
    // Habit count (total checked days)
    let totalHabitChecks = 0;
    if (habitData.length > 0) {
        totalHabitChecks = habitData.reduce((sum, habit) => sum + (habit.checked || 0), 0);
    }
    document.getElementById('habit-count').textContent = totalHabitChecks;
    
    // Task count (completed tasks)
    const completedTasks = taskData.filter(task => task.completed).length;
    document.getElementById('task-count').textContent = completedTasks;
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

// Display journal summary
function displayJournalSummary(journalData) {
    const container = document.getElementById('journal-preview');
    const emptyState = document.getElementById('journal-empty');
    
    if (journalData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Show only latest 3 entries
    const recentEntries = journalData.slice(0, 3);
    let html = '';
    
    recentEntries.forEach(entry => {
        const date = new Date(entry.date);
        const shortContent = entry.content.length > 80 
            ? entry.content.substring(0, 80) + '...' 
            : entry.content;
        
        html += `
            <div class="journal-item">
                <h4>${entry.title || 'No Title'}</h4>
                <p>${shortContent}</p>
                <div class="journal-date">
                    ${date.toLocaleDateString()} • ${entry.mood || ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display mood summary
function displayMoodSummary(moodData) {
    const container = document.getElementById('mood-chart');
    const emptyState = document.getElementById('mood-empty');
    
    if (moodData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Count moods by type
    const moodCounts = {};
    moodData.forEach(mood => {
        moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });
    
    // Define mood colors (matching your mood.js)
    const moodColors = {
        'excellent': '#2ecc71',
        'good': '#3498db',
        'neutral': '#f1c40f',
        'tired': '#e67e22',
        'stressed': '#e74c3c'
    };
    
    // Define display names
    const moodNames = {
        'excellent': 'Excellent',
        'good': 'Good',
        'neutral': 'Neutral',
        'tired': 'Tired',
        'stressed': 'Stressed'
    };
    
    // Get all possible moods
    const allMoods = ['excellent', 'good', 'neutral', 'tired', 'stressed'];
    
    // Find max count for scaling
    const maxCount = Math.max(...Object.values(moodCounts), 1);
    
    // Create chart
    let html = '';
    allMoods.forEach(mood => {
        const count = moodCounts[mood] || 0;
        const percentage = (count / maxCount) * 100;
        const height = Math.max(20, percentage); // Minimum height 20%
        
        html += `
            <div class="mood-bar">
                <div class="mood-bar-fill" style="
                    height: ${height}%;
                    background: ${moodColors[mood] || '#3498db'};
                "></div>
                <div class="mood-bar-label">
                    ${moodNames[mood]}<br>
                    <small>${count}</small>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display habit summary
function displayHabitSummary(habitData) {
    const container = document.getElementById('habit-stats');
    const emptyState = document.getElementById('habit-empty');
    
    if (habitData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    let html = '';
    habitData.forEach(habit => {
        const percentage = habit.total > 0 
            ? Math.round((habit.checked / habit.total) * 100) 
            : 0;
        
        html += `
            <div class="habit-item">
                <span class="habit-name">${habit.name}</span>
                <div class="habit-progress">
                    <span class="habit-count">${habit.checked}/${habit.total}</span>
                    <span>(${percentage}%)</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display task summary
function displayTaskSummary(taskData) {
    const container = document.getElementById('task-progress');
    const emptyState = document.getElementById('task-empty');
    
    if (taskData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const totalTasks = taskData.length;
    const completedTasks = taskData.filter(task => task.completed).length;
    const percentage = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;
    
    const html = `
        <div class="progress-circle" style="
            background: conic-gradient(#2ecc71 0% ${percentage}%, #ecf0f1 ${percentage}% 100%);
        ">
            <div class="progress-percentage">${percentage}%</div>
        </div>
        <div class="task-stat">
            <span class="task-stat-label">Tasks Completed</span>
            <span class="task-stat-value">${completedTasks}/${totalTasks}</span>
        </div>
        <div class="task-stat">
            <span class="task-stat-label">Completion Rate</span>
            <span class="task-stat-value">${percentage}%</span>
        </div>
    `;
    
    container.innerHTML = html;
}

// ============================================
// INSIGHTS GENERATION
// ============================================

// Generate weekly insights
function generateInsights(journalData, moodData, habitData, taskData) {
    const container = document.getElementById('insights-content');
    
    if (journalData.length === 0 && moodData.length === 0 && 
        habitData.length === 0 && taskData.length === 0) {
        container.innerHTML = '<p>Complete your daily activities to see insights here!</p>';
        return;
    }
    
    let insights = [];
    
    // Journal insight
    if (journalData.length > 0) {
        insights.push(`<div class="insight-item">
            <i class="fas fa-book"></i>
            You wrote ${journalData.length} journal entries this week.
        </div>`);
    }
    
    // Mood insight
    if (moodData.length > 0) {
        // Find most common mood
        const moodCounts = {};
        moodData.forEach(mood => {
            moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
        });
        
        const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
        
        const moodNames = {
            'excellent': 'Excellent',
            'good': 'Good',
            'neutral': 'Neutral',
            'tired': 'Tired',
            'stressed': 'Stressed'
        };
        
        insights.push(`<div class="insight-item">
            <i class="fas fa-smile"></i>
            Your most common mood was "${moodNames[mostCommonMood] || mostCommonMood}".
        </div>`);
    }
    
    // Habit insight
    if (habitData.length > 0) {
        const bestHabit = habitData.reduce((best, current) => {
            const bestRate = best.total > 0 ? best.checked / best.total : 0;
            const currentRate = current.total > 0 ? current.checked / current.total : 0;
            return currentRate > bestRate ? current : best;
        });
        
        const habitRate = bestHabit.total > 0 
            ? Math.round((bestHabit.checked / bestHabit.total) * 100) 
            : 0;
        
        insights.push(`<div class="insight-item">
            <i class="fas fa-chart-line"></i>
            "${bestHabit.name}" was your most consistent habit (${habitRate}%).
        </div>`);
    }
    
    // Task insight
    if (taskData.length > 0) {
        const completed = taskData.filter(task => task.completed).length;
        const total = taskData.length;
        const completionRate = Math.round((completed / total) * 100);
        
        insights.push(`<div class="insight-item">
            <i class="fas fa-tasks"></i>
            You completed ${completed} out of ${total} tasks (${completionRate}%).
        </div>`);
    }
    
    // Overall encouragement
    const totalActivities = journalData.length + moodData.length + 
                          habitData.reduce((sum, h) => sum + h.checked, 0) + 
                          taskData.filter(t => t.completed).length;
    
    if (totalActivities > 10) {
        insights.push(`<div class="insight-item">
            <i class="fas fa-star"></i>
            Great week! You logged ${totalActivities} activities. Keep it up!
        </div>`);
    }
    
    container.innerHTML = insights.join('');
}

// Make functions available globally if needed
console.log('Weekly Summary loaded successfully!');