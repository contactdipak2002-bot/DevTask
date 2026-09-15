const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskPriorityInput = document.getElementById('task-priority');
const submitBtn = document.getElementById('submit-btn');
const taskList = document.getElementById('task-list');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const searchInput = document.getElementById('search-input');
const filterPriority = document.getElementById('filter-priority');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editIndex = null;

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    const searchVal = searchInput.value.toLowerCase();
    const filterVal = filterPriority.value;

    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;

    tasks.forEach((task, index) => {
        const matchesSearch = task.title.toLowerCase().includes(searchVal);
        const matchesFilter = filterVal === 'All' || task.priority === filterVal;

        if (matchesSearch && matchesFilter) {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div>
                    <span class="task-text">${task.title}</span>
                    <span class="badge ${task.priority}">${task.priority}</span>
                </div>
                <div class="actions">
                    <button onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Done'}</button>
                    <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        }
    });

    totalCount.textContent = total;
    completedCount.textContent = completed;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = pct + '%';
    progressText.textContent = pct + '%';
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editIndex !== null) {
        tasks[editIndex].title = taskTitleInput.value;
        tasks[editIndex].priority = taskPriorityInput.value;
        editIndex = null;
        submitBtn.textContent = 'Add Task';
    } else {
        tasks.push({ title: taskTitleInput.value, priority: taskPriorityInput.value, completed: false });
    }
    taskTitleInput.value = '';
    saveAndRender();
});

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function editTask(index) {
    taskTitleInput.value = tasks[index].title;
    taskPriorityInput.value = tasks[index].priority;
    editIndex = index;
    submitBtn.textContent = 'Update';
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

searchInput.addEventListener('input', renderTasks);
filterPriority.addEventListener('change', renderTasks);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

renderTasks();