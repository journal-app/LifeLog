// To-Do List Application

let tasks = []; // Array to store all tasks
let currentFilter = 'all'; // Current filter: 'all', 'pending', 'completed'

// Start app when page loads
window.onload = function() {
    startTodoApp();
};

// Main function to setup the app
function startTodoApp() {
    loadTasks(); // Load saved tasks from localStorage
    setupEventListeners(); // Setup all button click events
    updateDisplay(); // Show tasks and update stats
}

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('lifeLogTasks');
    if (saved) {
        tasks = JSON.parse(saved);
        console.log('Loaded', tasks.length, 'tasks');
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('lifeLogTasks', JSON.stringify(tasks));
    console.log('Saved', tasks.length, 'tasks');
    updateStats(); // Update statistics after saving
}

// Setup all event listeners
function setupEventListeners() {
    // Add task button
    document.getElementById('add-btn').addEventListener('click', addNewTask);
    
    // Clear all button
    document.getElementById('clear-all-btn').addEventListener('click', clearAllTasks);
    
    // Add task on Enter key
    document.getElementById('task-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            // Set current filter
            currentFilter = this.getAttribute('data-filter');
            updateDisplay(); // Update displayed tasks
        });
    });
}

// Add a new task
function addNewTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    
    // Check if input is not empty
    if (!taskText) {
        alert('Please enter a task');
        taskInput.focus();
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        displayDate: new Date().toLocaleDateString()
    };
    
    // Add to beginning of array
    tasks.unshift(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input field
    taskInput.value = '';
    taskInput.focus();
    
    // Update display
    updateDisplay();
    
    console.log('Added new task:', taskText);
}

// Toggle task completion
function toggleTask(id) {
    // Find the task by id
    const task = tasks.find(t => t.id === id);
    if (task) {
        // Toggle completed status
        task.completed = !task.completed;
        saveTasks(); // Save changes
        updateDisplay(); // Update display
        console.log('Toggled task:', task.text);
    }
}

// Delete a single task
function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    
    // Remove task from array
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(); // Save changes
    updateDisplay(); // Update display
    console.log('Deleted task ID:', id);
}

// Clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) {
        alert('No tasks to clear');
        return;
    }
    
    if (!confirm('Clear ALL tasks? This cannot be undone.')) return;
    
    tasks = []; // Empty the array
    saveTasks(); // Save empty array
    updateDisplay(); // Update display
    console.log('Cleared all tasks');
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    // Update stat numbers
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (total > 0) {
        const percentage = Math.round((completed / total) * 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = percentage + '% complete';
    } else {
        progressFill.style.width = '0%';
        progressText.textContent = '0% complete';
    }
}

// Update the display of tasks
function updateDisplay() {
    const container = document.getElementById('tasks-list');
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    // Check if no tasks
    if (filteredTasks.length === 0) {
        let message = 'No tasks yet. Add your first task above!';
        if (currentFilter === 'pending') message = 'No pending tasks';
        if (currentFilter === 'completed') message = 'No completed tasks';
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>${message}</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    // Create HTML for each task
    let html = '';
    
    filteredTasks.forEach(task => {
        html += `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" 
                       ${task.completed ? 'checked' : ''}
                       onclick="toggleTask(${task.id})">
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-date">Added: ${task.displayDate}</div>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateStats(); // Update statistics after displaying
}

// Make functions available globally for onclick attributes
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// Debug info
console.log('To-Do List script loaded successfully!');