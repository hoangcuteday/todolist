# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the server (Express on port 3000)
- `npm install` — install dependencies

## Architecture

Todo list application with Express backend and vanilla JS frontend. All state is in-memory (no database).

- **server.js** — Express API server with token-based auth. Serves frontend as static files from `public/`.
- **public/** — Frontend SPA (plain HTML/CSS/JS, no build step). `app.js` handles login flow and communicates with the backend via fetch.

## Authentication

Bearer token auth using `crypto.randomUUID()`. Tokens stored in a server-side `Map` and in `localStorage` on the client.

Two roles:
- **admin** — full CRUD on todos (only role that can delete)
- **user** — can create, read, update todos but not delete

Middleware: `authenticate` validates token on all `/api/todos` routes. `requireRole('admin')` gates the DELETE endpoint.

## API Endpoints

All request/response bodies are JSON. Auth endpoints are public; todo endpoints require `Authorization: Bearer <token>` header.

- `POST /api/login` — authenticate (body: `{ username, password }`) → `{ token, user }`
- `POST /api/logout` — invalidate token
- `GET /api/me` — current user info
- `GET /api/todos` — list all
- `POST /api/todos` — create (body: `{ title }`)
- `PATCH /api/todos/:id` — update (body: `{ title?, completed? }`)
- `DELETE /api/todos/:id` — delete (admin only)
