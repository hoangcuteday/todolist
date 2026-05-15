const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');

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
  renderTodos(todos);
}

function renderTodos(todos) {
  list.innerHTML = '';
  emptyState.classList.toggle('hidden', todos.length > 0);

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const deleteBtn = currentUser.role === 'admin'
      ? `<button class="delete-btn">&times;</button>`
      : '';

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span>${escapeHtml(todo.title)}</span>
      ${deleteBtn}
    `;

    li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTodo(todo.id, !todo.completed));
    const del = li.querySelector('.delete-btn');
    if (del) del.addEventListener('click', () => deleteTodo(todo.id));

    list.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function addTodo(title) {
  await fetch('/api/todos', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title })
  });
  fetchTodos();
}

async function toggleTodo(id, completed) {
  await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ completed })
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE', headers: authHeaders() });
  fetchTodos();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login(usernameInput.value.trim(), passwordInput.value);
});

logoutBtn.addEventListener('click', logout);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTodo(title);
  input.value = '';
});

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
