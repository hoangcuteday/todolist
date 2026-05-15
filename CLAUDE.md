# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the server (Express on port 3000)
- `npm install` — install dependencies

## Architecture

This is a todo list application with an Express backend and vanilla JS frontend.

- **server.js** — Express API server. All todo state is held in-memory (no database). Serves the frontend as static files from `public/`.
- **public/** — Frontend SPA (plain HTML/CSS/JS, no build step). `app.js` communicates with the backend via fetch calls to `/api/todos`.

## API Endpoints

All endpoints under `/api/todos`. Request/response bodies are JSON.

- `GET /api/todos` — list all
- `POST /api/todos` — create (body: `{ title }`)
- `PATCH /api/todos/:id` — update (body: `{ title?, completed? }`)
- `DELETE /api/todos/:id` — delete
