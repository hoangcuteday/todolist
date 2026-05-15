const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS) || 3600000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = [
  { id: 1, username: 'admin', password: process.env.ADMIN_PASSWORD || 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: process.env.USER_PASSWORD || 'user123', role: 'user' },
];

const sessions = new Map();

let todos = [];
let nextId = 1;

function authenticate(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const session = sessions.get(token);
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }
  req.user = session.user;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = crypto.randomUUID();
  sessions.set(token, { user: { id: user.id, username: user.username, role: user.role }, createdAt: Date.now() });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.post('/api/logout', authenticate, (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  sessions.delete(token);
  res.status(204).end();
});

app.get('/api/me', authenticate, (req, res) => {
  res.json(req.user);
});

app.get('/api/todos', authenticate, (req, res) => {
  res.json(todos);
});

const VALID_STATUSES = ['todo', 'doing', 'done'];

app.post('/api/todos', authenticate, (req, res) => {
  const { title, status } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todoStatus = VALID_STATUSES.includes(status) ? status : 'todo';
  const todo = { id: nextId++, title: title.trim(), status: todoStatus };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  if (req.body.title !== undefined) todo.title = req.body.title.trim();
  if (req.body.status !== undefined && VALID_STATUSES.includes(req.body.status)) {
    todo.status = req.body.status;
  }
  res.json(todo);
});

app.delete('/api/todos/:id', authenticate, requireRole('admin'), (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  todos.splice(index, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
