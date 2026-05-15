const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

function authHeaders() {
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function showApp() {
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  userDisplay.textContent = `${currentUser.username} (${currentUser.role})`;
  fetchTodos();
}

function showLogin() {
  appSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  loginError.classList.add('hidden');
}

async function login(username, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const data = await res.json();
    loginError.textContent = data.error;
    loginError.classList.remove('hidden');
    return;
  }
  const data = await res.json();
  token = data.token;
  currentUser = data.user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(currentUser));
  showApp();
}

async function logout() {
  await fetch('/api/logout', { method: 'POST', headers: authHeaders() });
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showLogin();
}

async function fetchTodos() {
  const res = await fetch('/api/todos', { headers: authHeaders() });
  if (res.status === 401) {
    logout();
    return;
  }
  const todos = await res.json();
  renderBoard(todos);
}

function renderBoard(todos) {
  const statuses = ['todo', 'doing', 'done'];
  statuses.forEach(status => {
    const list = document.querySelector(`.card-list[data-status="${status}"]`);
    const count = document.querySelector(`[data-count="${status}"]`);
    const cards = todos.filter(t => t.status === status);
    count.textContent = cards.length;
    list.innerHTML = '';

    cards.forEach(todo => {
      const card = document.createElement('div');
      card.className = 'card';
      card.draggable = true;
      card.dataset.id = todo.id;

      const deleteBtn = currentUser.role === 'admin'
        ? `<button class="delete-btn" title="Delete">&times;</button>`
        : '';

      card.innerHTML = `
        <span class="card-title">${escapeHtml(todo.title)}</span>
        <div class="card-actions">${deleteBtn}</div>
      `;

      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);

      const del = card.querySelector('.delete-btn');
      if (del) del.addEventListener('click', () => deleteTodo(todo.id));

      list.appendChild(card);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

let draggedId = null;

function handleDragStart(e) {
  draggedId = e.target.dataset.id;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedId = null;
}

document.querySelectorAll('.card-list').forEach(list => {
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    list.classList.add('drag-over');
  });

  list.addEventListener('dragleave', () => {
    list.classList.remove('drag-over');
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    list.classList.remove('drag-over');
    if (draggedId) {
      moveTodo(parseInt(draggedId), list.dataset.status);
    }
  });
});

async function addTodo(title, status) {
  await fetch('/api/todos', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title, status })
  });
  fetchTodos();
}

async function moveTodo(id, status) {
  await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE', headers: authHeaders() });
  fetchTodos();
}

document.querySelectorAll('.add-card-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const title = input.value.trim();
    if (!title) return;
    addTodo(title, form.dataset.status);
    input.value = '';
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login(usernameInput.value.trim(), passwordInput.value);
});

logoutBtn.addEventListener('click', logout);

async function init() {
  if (token && currentUser) {
    const res = await fetch('/api/me', { headers: authHeaders() });
    if (res.ok) {
      showApp();
    } else {
      token = null;
      currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showLogin();
    }
  } else {
    showLogin();
  }
}

init();
