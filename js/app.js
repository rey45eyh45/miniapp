/**
 * Telegram Mini App - Vazifalar Ro'yxati (To-Do List)
 * =====================================================
 * Professional To-Do List App for Telegram
 * @version 2.0
 */

// ===== Telegram WebApp Initialization =====
const tg = window.Telegram?.WebApp;

// Initialize Telegram WebApp
function initTelegramApp() {
    if (tg) {
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('secondary_bg_color');
        tg.setBackgroundColor('#0a0a0f');
        
        // Setup MainButton
        if (tg.MainButton) {
            tg.MainButton.setText('✨ Vazifa qo\'shish');
            tg.MainButton.color = '#3b82f6';
            tg.MainButton.textColor = '#ffffff';
        }
        
        console.log('✅ Telegram WebApp initialized');
        console.log('👤 User:', tg.initDataUnsafe?.user?.first_name || 'Guest');
    } else {
        console.log('🌐 Running in browser mode');
    }
}

// ===== App State =====
let tasks = [];
let currentFilter = 'all';
let currentPriority = 'low';

// ===== DOM Elements =====
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const priorityBtns = document.querySelectorAll('.priority-btn');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const countAll = document.getElementById('countAll');
const countActive = document.getElementById('countActive');
const countCompleted = document.getElementById('countCompleted');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ===== Local Storage =====
const STORAGE_KEY = 'telegram_todo_tasks_v2';

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('❌ Failed to save tasks:', e);
    }
}

function loadTasks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            tasks = JSON.parse(saved);
        }
    } catch (e) {
        console.error('❌ Failed to load tasks:', e);
        tasks = [];
    }
}

// ===== Toast Notifications =====
function showToast(message, icon = '✓') {
    toastMessage.textContent = message;
    toast.querySelector('.toast-icon').textContent = icon;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ===== Haptic Feedback =====
function haptic(type = 'light') {
    if (tg?.HapticFeedback) {
        switch(type) {
            case 'light':
                tg.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                tg.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                tg.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'warning':
                tg.HapticFeedback.notificationOccurred('warning');
                break;
            case 'error':
                tg.HapticFeedback.notificationOccurred('error');
                break;
        }
    }
}

// ===== Task Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Hozir';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} daqiqa oldin`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} soat oldin`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} kun oldin`;
    
    return date.toLocaleDateString('uz-UZ', { 
        day: 'numeric', 
        month: 'short' 
    });
}

function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
        haptic('error');
        showToast('Vazifa matnini kiriting!', '⚠️');
        return;
    }
    
    if (trimmedText.length < 2) {
        haptic('error');
        showToast('Vazifa juda qisqa!', '⚠️');
        return;
    }
    
    const task = {
        id: generateId(),
        text: trimmedText,
        completed: false,
        priority: currentPriority,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    
    haptic('success');
    showToast('Vazifa qo\'shildi!', '✅');
    
    // Reset input
    taskInput.value = '';
    taskInput.focus();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        
        if (task.completed) {
            haptic('success');
            showToast('Barakalla! Vazifa bajarildi! 🎉', '🎯');
        } else {
            haptic('medium');
        }
    }
}

function deleteTask(id) {
    const taskEl = document.querySelector(`[data-id="${id}"]`);
    if (taskEl) {
        taskEl.classList.add('deleting');
        
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }, 300);
    }
    
    haptic('warning');
    showToast('Vazifa o\'chirildi', '🗑️');
}

function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        haptic('error');
        showToast('Bajarilgan vazifalar yo\'q', '⚠️');
        return;
    }
    
    const confirmClear = () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        haptic('success');
        showToast(`${completedCount} ta vazifa o'chirildi`, '🧹');
    };
    
    if (tg?.showConfirm) {
        tg.showConfirm(
            `${completedCount} ta bajarilgan vazifani o'chirmoqchimisiz?`,
            (confirmed) => {
                if (confirmed) confirmClear();
            }
        );
    } else {
        if (confirm(`${completedCount} ta bajarilgan vazifani o'chirmoqchimisiz?`)) {
            confirmClear();
        }
    }
}

// ===== Filter & Priority Functions =====
function setFilter(filter) {
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    haptic('light');
    renderTasks();
}

function setPriority(priority) {
    currentPriority = priority;
    
    priorityBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.priority === priority);
    });
    
    haptic('light');
}

function getFilteredTasks() {
    let filtered;
    switch (currentFilter) {
        case 'active':
            filtered = tasks.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = tasks.filter(t => t.completed);
            break;
        default:
            filtered = [...tasks];
    }
    
    // Sort by priority (high > medium > low) and then by date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

// ===== Render Functions =====
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    tasksList.innerHTML = '';
    
    const showEmpty = filteredTasks.length === 0;
    emptyState.classList.toggle('hidden', !showEmpty);
    
    filteredTasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        tasksList.appendChild(li);
    });
    
    updateStats();
    updateProgress();
    updateCounts();
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
    li.dataset.id = task.id;
    li.style.animationDelay = `${index * 0.05}s`;
    
    const timeAgo = formatTime(task.createdAt);
    const priorityLabels = { low: 'Past', medium: 'O\'rta', high: 'Yuqori' };
    
    li.innerHTML = `
        <div class="task-checkbox" role="checkbox" aria-checked="${task.completed}" tabindex="0"></div>
        <div class="task-content">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-meta">
                <span class="task-time">🕐 ${timeAgo}</span>
                <span class="task-category">${priorityLabels[task.priority]}</span>
            </div>
        </div>
        <button class="delete-btn" aria-label="O'chirish">🗑️</button>
    `;
    
    // Event listeners
    const checkbox = li.querySelector('.task-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    
    checkbox.addEventListener('click', () => toggleTask(task.id));
    checkbox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTask(task.id);
        }
    });
    
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
    
    clearCompletedBtn.disabled = completed === 0;
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

function updateCounts() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    countAll.textContent = total;
    countActive.textContent = active;
    countCompleted.textContent = completed;
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Add task button
    addTaskBtn.addEventListener('click', () => {
        addTask(taskInput.value);
    });
    
    // Enter key to add task
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
    
    // Priority buttons
    priorityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setPriority(btn.dataset.priority);
        });
    });
    
    // Clear completed button
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Telegram MainButton
    if (tg?.MainButton) {
        tg.MainButton.onClick(() => {
            taskInput.focus();
            haptic('light');
            
            if (taskInput.value.trim()) {
                addTask(taskInput.value);
            }
        });
        // Uncomment to show MainButton
        // tg.MainButton.show();
    }
    
    // Handle back button
    if (tg?.BackButton) {
        tg.BackButton.onClick(() => {
            if (tasks.length > 0) {
                tg.showConfirm('Ilovadan chiqmoqchimisiz?', (confirmed) => {
                    if (confirmed) tg.close();
                });
            } else {
                tg.close();
            }
        });
    }
    
    // Focus effect on input
    taskInput.addEventListener('focus', () => {
        haptic('light');
    });
}

// ===== Initialize App =====
function init() {
    initTelegramApp();
    loadTasks();
    setupEventListeners();
    renderTasks();
    
    console.log('🚀 To-Do App initialized');
    console.log(`📋 Loaded ${tasks.length} tasks`);
    
    // Welcome message for new users
    if (tasks.length === 0 && tg?.initDataUnsafe?.user) {
        const userName = tg.initDataUnsafe.user.first_name;
        setTimeout(() => {
            showToast(`Xush kelibsiz, ${userName}! 👋`, '🎉');
        }, 500);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
