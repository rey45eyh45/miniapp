/**
 * Telegram Mini App - Vazifalar Ro'yxati (To-Do List)
 * =====================================================
 * Bu ilova Telegram ichida ishlash uchun yaratilgan
 */

// ===== Telegram WebApp Initialization =====
const tg = window.Telegram?.WebApp;

// Initialize Telegram WebApp
function initTelegramApp() {
    if (tg) {
        // Ready signal
        tg.ready();
        
        // Expand to full height
        tg.expand();
        
        // Enable closing confirmation
        tg.enableClosingConfirmation();
        
        // Set header color
        tg.setHeaderColor('secondary_bg_color');
        
        console.log('Telegram WebApp initialized');
        console.log('User:', tg.initDataUnsafe?.user);
    } else {
        console.log('Running outside Telegram');
    }
}

// ===== App State =====
let tasks = [];
let currentFilter = 'all';

// ===== DOM Elements =====
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== Local Storage =====
const STORAGE_KEY = 'telegram_todo_tasks';

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks:', e);
    }
}

function loadTasks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            tasks = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load tasks:', e);
        tasks = [];
    }
}

// ===== Task Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    
    const task = {
        id: generateId(),
        text: trimmedText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    
    // Haptic feedback
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Show notification
    showNotification('Vazifa qo\'shildi! ✅');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        
        // Haptic feedback
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    
    // Haptic feedback
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('warning');
    }
}

function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) return;
    
    // Show confirmation using Telegram popup or native confirm
    if (tg?.showConfirm) {
        tg.showConfirm(
            `${completedCount} ta bajarilgan vazifani o'chirmoqchimisiz?`,
            (confirmed) => {
                if (confirmed) {
                    tasks = tasks.filter(t => !t.completed);
                    saveTasks();
                    renderTasks();
                    showNotification('Bajarilgan vazifalar o\'chirildi');
                }
            }
        );
    } else {
        if (confirm(`${completedCount} ta bajarilgan vazifani o'chirmoqchimisiz?`)) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
        }
    }
}

// ===== Filter Functions =====
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// ===== Render Functions =====
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Clear list
    tasksList.innerHTML = '';
    
    // Show/hide empty state
    const showEmpty = filteredTasks.length === 0;
    emptyState.classList.toggle('hidden', !showEmpty);
    
    // Render tasks
    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        tasksList.appendChild(li);
    });
    
    // Update stats
    updateStats();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <div class="task-checkbox" role="checkbox" aria-checked="${task.completed}"></div>
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="delete-btn" aria-label="O'chirish">🗑️</button>
    `;
    
    // Event listeners
    const checkbox = li.querySelector('.task-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    
    checkbox.addEventListener('click', () => toggleTask(task.id));
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    return li;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    totalTasksEl.textContent = `${total} ta vazifa`;
    completedTasksEl.textContent = `${completed} ta bajarildi`;
    
    // Enable/disable clear button
    clearCompletedBtn.disabled = completed === 0;
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    if (tg?.showPopup) {
        // Use Telegram's native popup for simple notifications
        // For now, just log it
        console.log('Notification:', message);
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Add task button
    addTaskBtn.addEventListener('click', () => {
        addTask(taskInput.value);
        taskInput.value = '';
        taskInput.focus();
    });
    
    // Enter key to add task
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
    
    // Clear completed button
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Telegram MainButton (optional usage)
    if (tg?.MainButton) {
        tg.MainButton.setText('Yangi vazifa');
        tg.MainButton.onClick(() => {
            taskInput.focus();
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
        // tg.MainButton.show(); // Uncomment to show MainButton
    }
    
    // Handle back button
    if (tg?.BackButton) {
        tg.BackButton.onClick(() => {
            tg.close();
        });
    }
}

// ===== Initialize App =====
function init() {
    initTelegramApp();
    loadTasks();
    setupEventListeners();
    renderTasks();
    
    console.log('To-Do App initialized');
    console.log(`Loaded ${tasks.length} tasks`);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
