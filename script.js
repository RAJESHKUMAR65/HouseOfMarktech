const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }


  filteredTasks = filteredTasks.sort((a, b) => b.createdAt - a.createdAt);

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false, createdAt: Date.now() });
    showToast('Task Added!');
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
}

function deleteTask(index) {
    const taskItems = document.querySelectorAll('.task-item');
    const taskItem = taskItems[index];
  
    
    taskItem.classList.add('fade-out');
  
    
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }, 300);  
    showToast('Task Deleted!');
  }
  

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
    }, 2000); 
  }

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

taskForm.addEventListener('submit', addTask);

 
renderTasks();
