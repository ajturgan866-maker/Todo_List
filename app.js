// Элементы страницы
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

// Начальные задачи как на скриншоте задания
const DEFAULT_TASKS = [
  { id: 1, text: 'Сделать дз по веб', completed: false },
  { id: 2, text: 'Сделать домашнее задание по мат', completed: false },
  { id: 3, text: 'Не ругаться с Корякином ', completed: false }
];

// Загрузка задач из localStorage
let tasks = loadTasks();

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [...DEFAULT_TASKS];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Отображение задач на экране
function render() {
  todoList.innerHTML = '';

  // Если список пустой — показываем надпись "Список задач пустой"
  if (tasks.length === 0) {
    emptyMessage.classList.add('active');
  } else {
    emptyMessage.classList.remove('active');
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // Текст задачи (при клике зачеркивается)
    const span = document.createElement('span');
    span.className = `task-text ${task.completed ? 'completed' : ''}`;
    span.textContent = task.text;
    span.title = 'Нажмите, чтобы зачеркнуть/восстановить';
    span.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      render();
    });

    // Кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.title = 'Удалить задачу';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      render();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Добавление новой задачи
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  render();

  taskInput.value = '';
  taskInput.focus();
}

// Слушатели событий
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Первоначальная отрисовка
render();
